import sys, os
if len(sys.argv) < 2:
    sys.exit('Missing filepath')
filepath = sys.argv[1]
os.makedirs(os.path.dirname(filepath), exist_ok=True)
content = sys.stdin.read()
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Successfully wrote {filepath} ({len(content)} chars)')
