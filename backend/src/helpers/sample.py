import re

# A set of all allowed file extensions for parsing files
ALLOWED_EXTENSIONS = {'txt'}

# Method to check the filetype of a given filename
def check_allowed_filetype(filename):
    """
    Checks if the filetype is allowed
    :param filename: The filename to check
    :return: True if the filetype is allowed, False otherwise
    """
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def parse_data_from_file(file):
    """
    Parses the data from a given machine output file and returns the data in a JSON format
    :param file: The file to parse from the POST request
    :return: JSON data of the parsed machine output file
    """
    if not check_allowed_filetype(file.filename):
        raise Exception("Invalid file type")

    # Read the file line-by-line, storing each line in the array below/
    content_lines = []
    for line in file:
        line_content = line.decode('utf-8').strip()
        content_lines.append(line_content)
    if "vetscan vs2" in content_lines[0].lower():
        print("This is VetScan VS2!")
        machine_data = sample_helper._parse_vetscan_vs2(content_lines)
        return machine_data
    else:
        raise Exception("Invalid Machine")
    # remove end line characters

def _parse_vetscan_vs2(content_lines):
    """
    Parses the data from a given VetScan VS2 output file and returns the data in a JSON format
    :param content_lines: The lines of the file to parse
    :return: JSON data of the parsed machine output file
    """
    ret_dict = {
        "name": content_lines[0],
        "info": [
            {"key": "Timestamp of Test", "value": re.sub(" +", " ", content_lines[2])},
        ],
        "measurements": []
    }
    is_error_file = False

    if is_error_file:
        print("Error file")

    info_flag = True
    measurement_flag = False
    print("MEASUREMENTS-----------------------")
    for row_idx in range(3, len(content_lines)):
        row = content_lines[row_idx]
        print("CHECKING:" + row)
        # While pulling basic measurements,
        if info_flag:
            if re.search(r"^[.]+", row):
                info_flag = False
                measurement_flag = True
            else:
                key = row.split(":")[0].strip()
                value = row.split(":")[1].strip()
                print("NEW:", {"key": key, "value": value})
                ret_dict["info"].append({"key": key, "value": value})

        # While pulling basic measurements,
        elif measurement_flag:
            # Are we at the end of the basic measurements?
            if row.strip() == "":
                print("EXTRA-----------------------")
                measurement_flag = False
            else:
                if re.search(r"^[0-9]{2} ([0-9ABCDEF]{4}  ){1,4} *", row):
                    is_error_file = True
                else:
                    row_contents = re.sub(" +", " ", row).split()
                    print(row_contents)
                    # For non-error files with issue measurements
                    if len(row_contents) != 3 and not is_error_file:
                        data = ""
                        for j in range(1, len(row_contents) - 1):
                            data = data + row_contents[j] + " "
                            new_meas = {"key": row_contents[0].strip(), "value": data.strip(), "units": row_contents[len(row_contents)-1].strip()}
                    else:
                        # For all other measurements
                        new_meas = {"key": row_contents[0].strip(), "value": row_contents[1].strip(), "units": row_contents[len(row_contents)-1].strip()}
                    print("NEW:", new_meas)
                    ret_dict["measurements"].append(new_meas)
        else:
            # You are finished with basic measurements. Switch to extra info.
            if re.search(r"^QC +[A-Za-z0-9]+ *", row):
                row_contents = re.sub(" +", " ", row).strip().split()
                print("QC: ", row_contents)
                new_meas = {"key": row_contents[0].strip(), "value": row_contents[1].strip()}
                print("NEW:", new_meas)
                ret_dict["measurements"].append(new_meas)
            # If row is RQC Row
            if re.search(r"^RQC: [0-9]+ *", row):
                row_contents = re.sub(" +", " ", row).strip().split(":")
                print("RQC: ", row_contents)
                new_meas = {"key": row_contents[0].strip(), "value": row_contents[1].strip()}
                print("NEW:", new_meas)
                ret_dict["measurements"].append(new_meas)
            if re.search(r"^HEM *[0-9+-]+ +LIP *[0-9+-]+ +ICT *[0-9+-]+ *", row):
                row_contents = re.sub(" +", " ", row).strip().split()
                print("Extra: ", row_contents)
                new_meas = [
                    {"key": row_contents[0].strip(
                    ), "value": row_contents[1].strip()},
                    {"key": row_contents[2].strip(
                    ), "value": row_contents[3].strip()},
                    {"key": row_contents[4].strip(
                    ), "value": row_contents[5].strip()}
                ]
                print("NEW:", new_meas)
                ret_dict["measurements"].extend(new_meas)

    print(ret_dict)
    return ret_dict


def _is_error_file(content_lines):
    """
    Checks if the file is an error file.
    :param content_lines:
    :return: True if error file, False otherwise
    """
    is_error_file = False

    temp = re.search(r"^[0-9]{2} ([0-9A-F]{1,4}[ ]*){1,4}", content_lines[8])
    if temp:
        is_error_file = True
    return is_error_file