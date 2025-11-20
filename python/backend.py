import os
import sys
import json
from xai import Grok

def main():
    api_key = os.getenv('XAI_API_KEY')
    if not api_key:
        error = {'error': 'XAI_API_KEY environment variable is not set.'}
        sys.stdout.write(json.dumps(error) + '\n')
        sys.stdout.flush()
        return

    try:
        client = Grok(api_key=api_key)
    except Exception as e:
        error = {'error': f'Failed to initialize Grok client: {e}'}
        sys.stdout.write(json.dumps(error) + '\n')
        sys.stdout.flush()
        return

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
            if messages:
                # Use conversation history if provided
                formatted_messages = []
                for msg in messages:
                    formatted_messages.append({
                        'role': msg.get('role', 'user'),
                        'content': msg.get('content', '')
                    })
                response = client.chat(formatted_messages)
            else:
                # Fall back to single message for backward compatibility
                message = data.get('message', '')
                response = client.chat(message)

            reply = {'id': id, 'reply': str(response)}
            sys.stdout.write(json.dumps(reply) + '\n')
            sys.stdout.flush()
        except Exception as e:
            reply = {'id': id, 'error': str(e)}
            sys.stdout.write(json.dumps(reply) + '\n')
            sys.stdout.flush()

if __name__ == '__main__':
    main()
