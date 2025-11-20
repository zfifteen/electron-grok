import os
import sys
import json

# Try to import the original 'xai' package (used by older code). If unavailable, fall back to the
# installed 'xai_sdk' package (newer SDK). This makes the backend compatible with either.
try:
    from xai import Grok  # type: ignore
    _HAS_LEGACY_XAI = True
except Exception:
    _HAS_LEGACY_XAI = False

if not _HAS_LEGACY_XAI:
    try:
        from xai_sdk import Client as XaiClient
        from xai_sdk.proto import chat_pb2
    except Exception:
        XaiClient = None
        chat_pb2 = None


def _send_reply(reply_obj):
    sys.stdout.write(json.dumps(reply_obj) + '\n')
    sys.stdout.flush()


def main():
    api_key = os.getenv('XAI_API_KEY')
    if not api_key:
        error = {'error': 'XAI_API_KEY environment variable is not set.'}
        _send_reply(error)
        return

    # Initialize client
    if _HAS_LEGACY_XAI:
        try:
            client = Grok(api_key=api_key)
        except Exception as e:
            error = {'error': f'Failed to initialize Grok client: {e}'}
            _send_reply(error)
            return

        use_legacy = True
    else:
        if XaiClient is None or chat_pb2 is None:
            error = {'error': 'No compatible xAI Python SDK is installed (tried xai and xai_sdk).'}
            _send_reply(error)
            return

        try:
            client = XaiClient(api_key=api_key)
        except Exception as e:
            error = {'error': f'Failed to initialize xai_sdk client: {e}'}
            _send_reply(error)
            return

        use_legacy = False

    # Helper function to convert role string to MessageRole enum
    def _role_to_enum(role_str: str):
        """Convert role string to chat_pb2.MessageRole enum value."""
        if not role_str:
            return chat_pb2.MessageRole.ROLE_USER
        r = role_str.lower()
        mapping = {
            'user': chat_pb2.MessageRole.ROLE_USER,
            'assistant': chat_pb2.MessageRole.ROLE_ASSISTANT,
            'system': chat_pb2.MessageRole.ROLE_SYSTEM,
            'function': chat_pb2.MessageRole.ROLE_FUNCTION,
            'tool': chat_pb2.MessageRole.ROLE_TOOL,
        }
        return mapping.get(r, chat_pb2.MessageRole.ROLE_USER)

    # Main loop: read JSON lines from stdin, respond via stdout
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        id = None
        try:
            data = json.loads(line)
            id = data.get('id')

            # Support conversation history for context preservation
            messages = data.get('messages', [])
            if use_legacy:
                # Legacy client expected a simple call
                try:
                    if messages:
                        # Some legacy clients expect a plain string. Convert structured messages
                        # to a single prompt string to avoid proto enum mismatches.
                        if isinstance(messages, list) and isinstance(messages[0], dict):
                            parts = []
                            for mm in messages:
                                role = mm.get('role', 'user').capitalize()
                                content = mm.get('content', '')
                                parts.append(f"{role}: {content}")
                            prompt = "\n".join(parts)
                            response = client.chat(prompt)
                        else:
                            # fallback: send the messages as-is
                            response = client.chat(messages)
                    else:
                        message = data.get('message', '')
                        response = client.chat(message)
                    reply = {'id': id, 'reply': str(response)}
                except Exception as e:
                    reply = {'id': id, 'error': str(e)}
            else:
                # xai_sdk Client: construct proto messages and call client.chat.create(...).sample()
                try:
                    # Build chat_pb2.Message objects
                    proto_msgs = []
                    for m in messages:
                        role = m.get('role', 'user')
                        content = m.get('content', '')
                        # Convert role string to MessageRole enum
                        msg = chat_pb2.Message(
                            role=_role_to_enum(role),
                            content=[chat_pb2.Content(text=content)]
                        )
                        proto_msgs.append(msg)

                    if not proto_msgs:
                        # No messages provided; fall back to single message field if present
                        single = data.get('message', '')
                        proto_msgs = [chat_pb2.Message(
                            role=_role_to_enum('user'),
                            content=[chat_pb2.Content(text=single)]
                        )]

                    chat_req = client.chat.create(model='grok-4-fast-reasoning', messages=proto_msgs)
                    resp = chat_req.sample()
                    # Response object exposing .content in the SDK examples
                    content = getattr(resp, 'content', None)
                    if content is None:
                        # Fallback to str()
                        content = str(resp)
                    reply = {'id': id, 'reply': str(content)}
                except Exception as e:
                    reply = {'id': id, 'error': str(e)}

            _send_reply(reply)
        except Exception as e:
            reply = {'id': id, 'error': str(e)}
            _send_reply(reply)


if __name__ == '__main__':
    main()
