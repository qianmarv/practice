# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

driver = webdriver.PhantomJS()
driver.get("http://www.renren.com/")

# 输入账号密码
driver.find_element_by_name("email").send_keys("账户")
driver.find_element_by_name("password").send_keys("密码")

# 模拟点击登录
driver.find_element_by_xpath("//input[@class='input-submit login-btn']").click()

# 等待3秒
time.sleep(3)

# 生成登陆后快照
driver.save_screenshot("renren.png")
