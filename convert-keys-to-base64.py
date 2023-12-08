import subprocess

def convert_key_to_base64(file_path):
    # Run the base64 command and capture the output
    result = subprocess.run(['base64', file_path], capture_output=True, text=True)

    # Check if the command was successful
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    else:
        return result.stdout

# Use the function
base64_key = convert_key_to_base64('public_key.pem')
print(base64_key)