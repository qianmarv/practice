import numpy as np
import cv2 as cv
from matplotlib import pyplot as plt
img = cv.imread('horse.jpg', 0)
plt.imshow(img, cmap = 'gray', interpolation = 'bicubic')
plt.xticks([]), plt.yticks([])
plt.show()
# ---------------------------------
# import cv2 as cv
# import numpy as np

# # Load an color image in grayscale
# img = cv.imread('horse.jpg', 0)

# cv.imshow('image', img)
# k = cv.waitKey(0) & 0xFF
# if k == 27:
#     cv.destroyAllWindows()
# elif k == ord('s'):
#     cv.imwrite('horsegray.png', img)
#     cv.destroyAllWindows()
