from gradio_client import Client, handle_file
import ast


client = Client("microsoft/OmniParser")


result = client.predict(
    image_input=handle_file("/home/subhan/Desktop/AcademiX/ML/tt.jpeg"),
    box_threshold=0.05,
    iou_threshold=0.1,
    api_name="/process"
)


elem = result[0]
parsed = result[1]
coordinatesStr = result[2]


coordinatesDict = ast.literal_eval(coordinatesStr)

result_dict = {}
for line in parsed.strip().split("\n"):
    try:

        key_part, value = line.split(": ")
        numeric_id = int(key_part.split(" ")[-1])  # Extract numeric ID from key
        result_dict[numeric_id] = value
    except ValueError:
        print(f"Skipping line due to incorrect format: {line}")

full_weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


filtered_dict = {
    key: value
    for key, value in result_dict.items()
    if (
        any(day in value for day in ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]) 
        or value in full_weekdays  
        or any(char.isdigit() for char in value if ":" in value)  
        or value.startswith(("CS", "EC")) 
    )
}


valuable_keys = list(filtered_dict.keys())  

print("Valuable Keys:", valuable_keys)
print("Coordinates Dictionary Keys:", coordinatesDict.keys())


filtered_coordinates = {
    int(key): value  
    for key, value in coordinatesDict.items()
    if int(key) in valuable_keys  
}


print("Filtered Coordinates:", filtered_coordinates)
