import os
import urllib
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

def abspath_url(path):
    file_path = os.path.abspath(path)
    return urllib.parse.urljoin(
        'file:',
        urllib.request.pathname2url(file_path)
    )

def get_base_url():
    driver.get("about:memory")

    driver.find_element(By.ID, "measureButton").click()
    sleep(1)

    t = driver.find_element(
        By.XPATH,
        "//*[contains(text(), 'name=\"ShortSearch\", baseURL=')]"
    ).text

    return t.split("baseURL=")[1].rstrip(")")

def init_driver():
    options = webdriver.FirefoxOptions()
    #options.add_argument("-headless");
    options.browser_version = "79.0"

    driver = webdriver.Firefox(options=options)
    driver.install_addon("build/cache/gecko", temporary=True)
    action = ActionChains(driver)
    return (driver, action)

driver, action = init_driver()

driver.get(abspath_url("./shortsearch/test.html"))
sel_test_txt = driver.find_elements(By.CLASS_NAME, "sel_test_txt")

for i in range(len(sel_test_txt)):
    driver.execute_script("""
        function selectElementContents(el) {
            if (window.getSelection && document.createRange) {
                let sel = window.getSelection();
                let range = document.createRange();
                range.selectNodeContents(el);
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && document.body.createTextRange) {
                let textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.select();
            }
        }""" +
        f"selectElementContents(document.getElementsByClassName(\"sel_test_txt\")[{i}])"
    )
    sleep(1)

    action\
        .key_down(Keys.CONTROL)\
        .key_down(Keys.ALT)\
        .send_keys("s")\
        .key_up(Keys.CONTROL)\
        .key_up(Keys.ALT)\
        .perform()


#driver.get(getBaseURL() + "/options.html")
driver.close()
