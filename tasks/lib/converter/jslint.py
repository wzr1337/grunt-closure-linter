#!/usr/bin/env python
import sys
import re

skipline_prefix = 'Skipping'
filename_line_prefix = '----- FILE  :'
filename_line_suffix = '-----'
error_line_prefix = 'Line '
error_code_regex = 'E:\-?\d{3,4}:'

def convert(input, output):

    # write head of output
    output.write('<?xml version="1.0" encoding="utf-8"?>\n')
    output.write('<jslint>\n')

    writing_file_errors = False
    # write error list
    for line in input:
        if (is_skipping_line(line)):
            continue
        elif (is_filename_line(line)):
            if (writing_file_errors):
                close_file_section(output)
            filename = get_filename(line)
            output.write(''.join(['<file name="', filename, '">\n']))
            writing_file_errors = True
        elif (is_empty_line(line)):
            close_file_section(output)
            writing_file_errors = False
        elif (is_error_line(line)):
            code_line_number = get_code_line_number(line)
            error_message = get_error_message(line)
            output.write(''.join(['<issue line="', code_line_number ,'" char="0" reason="', error_message, '" evidence="" />\n']))
        else:
            close_file_section(output)
            break

    # write tail of output
    output.write('</jslint>\n')


def is_skipping_line(line):
    return 0 == line.find(skipline_prefix)


def is_empty_line(line):
    return '\n' == line


def is_filename_line(line):
    return 0 == line.find(filename_line_prefix)


def get_filename(line):
    filename = line
    filename = filename.replace(filename_line_prefix, '')
    filename = filename.replace(filename_line_suffix, '')
    filename = filename.strip()
    return filename


def is_error_line(line):
    return 0 == line.find(error_line_prefix)


def get_error_message(line):
    error_message_regex = error_code_regex + '(.*)$'
    matches = re.search(error_message_regex, line)
    message = matches.group(1)
    message = escape_xml_string(message)
    return message.strip()


def get_code_line_number(line):
    code_line_number_regex = error_line_prefix + '(\d+), ' + error_code_regex
    matches = re.search(code_line_number_regex, line)
    return matches.group(1).strip()


def escape_xml_string(string):
    string = string.replace('&', '&amp;')
    string = string.replace('"', '&quot;')
    string = string.replace('<', '&lt;')
    string = string.replace('>', '&gt;')
    return string


def close_file_section(output):
    output.write('</file>\n')


if __name__ == '__main__':
    convert(sys.stdin, sys.stdout)
