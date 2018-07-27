import urllib

from PIL import Image
import pytesseract

from resizeimage import resizeimage

import os
import cv2

import numpy as np

def get_string(img_path):
    img = cv2.imread(img_path)

    img = cv2.cvColor(img, cv2.COLOR_BGR2GRAY)

    kernel = np.ones((1, 1), np.uint8)
    img = cv2.dilate(img, kernel, iterations = 1)
    img = cv2.erode(img, kernel, iterations = 1)

    cv2.imwrite(src_path + "removed_noise.png", img)

    img = cv2.adaptiveThreshold(img, )
