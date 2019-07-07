import json
# from collections import defaultdict
from pandas import DataFrame, Series
import pandas as pd
import numpy as np

path = './example.txt'
records = [json.loads(line) for line in open(path)]
# time_zones = [rec['tz'] for rec in records if 'tz' in rec]

frame = DataFrame(records)
# tz_counts = frame['tz'].value_counts()

clean_tz = frame['tz'].fillna('Missing')
clean_tz[clean_tz == ''] = 'Unknow'
tz_counts = clean_tz.value_counts()

tz_counts[:10].plot(kind='barh', rot=0)

# def get_counts(seq):
#     counts = {}
#     for x in seq:
#         if x in counts:
#             counts[x] += 1
#         else:
#             counts[x] = 1
#     return counts

# def get_counts2(seq):
#     counts = defaultdict(int)
#     for x in seq:
#         counts[x] += 1
#     return counts

# counts = get_counts2(time_zones)

# def top_counts(count_dict, n=10):
#     pairs = [(count, tz) for tz, count in count_dict.items()]
#     pairs.sort()
#     return pairs[-n:]


# print("Hello World!")

# def my_abs(x):
#     if x >= 0:
#         return x
#     else:
#         return -x

# from sys import argv
# script, user_name = argv
# prompt = '>'

# print(f"Hi {user_name}, I'm the {script} script.")
# print("I'd like to ask you a few questions.")
# print(f"Do you like me {user_name}")
# likes = input(prompt)

# print(f"Where do you live {user_name}?")
# lives = input(prompt)

# print("what kind of computer do you have?")
# computer = input(prompt)

# print(f"""
# Alright, so you said{likes} about liking me.
# You live in {lives}, Not sure where that is.
# And you have a {computer} computer. Nice.
# """)

# from sys import argv
# script, filename = argv

# txt = open(filename)

# print(f"Here's your file {filename}:")
# print(txt.read())

# print("Type the filename again:")
# file_again = input("> ")

# txt_again = input("> ")

# print(txt_again.read())
# __author__ = 'Lao Qian'

# import sys

# def test():
#     args = sys.argv
#     if len(args) == 1:
#         print('Hello World!')
#     elif len(args) == 2:
#         print('Hello %s' % args[1])
#     else:
#         print('Too many!')

# if __name__ == '__main__':
#     test()

