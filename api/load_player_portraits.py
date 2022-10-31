import requests
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import threading

driver = webdriver.Chrome(executable_path=r'C:\Users\Lugia\OneDrive\Desktop\ca-dgeller\api\chromedriver.exe')

cookies = {
    'PHPSESSID': 'mrfksg17056nvcck1purkd9of7',
    'currency': 'eur',
    'statsui': 'cat',
    '__cf_bm': 'Z5KnDyviX3zPhqm6C.YFPnFh_xaumP668IcRRpyhtJc-1667165263-0-Aenrgb/P/dampqFZPp0VHh2DGQmKwbKvBdblDZlrcsVfcXUDczXT+Qo0zq11zziZU75ZBOkSZD4bGz9VzoCLvUbdfMRY7+vJBw2Mc5b1ZXGm/uJlQWneG3Bu6BPdoN2cXA==',
    'sc_is_visitor_unique': 'rx12435742.1667165410.3EE0C47BA0214F922CDBC4724AA00D50.1.1.1.1.1.1.1.1.1',
}

headers = {
    'authority': 'www.fifacm.com',
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    # Requests sorts cookies= alphabetically
    # 'cookie': 'PHPSESSID=mrfksg17056nvcck1purkd9of7; currency=eur; statsui=cat; __cf_bm=Z5KnDyviX3zPhqm6C.YFPnFh_xaumP668IcRRpyhtJc-1667165263-0-Aenrgb/P/dampqFZPp0VHh2DGQmKwbKvBdblDZlrcsVfcXUDczXT+Qo0zq11zziZU75ZBOkSZD4bGz9VzoCLvUbdfMRY7+vJBw2Mc5b1ZXGm/uJlQWneG3Bu6BPdoN2cXA==; sc_is_visitor_unique=rx12435742.1667165410.3EE0C47BA0214F922CDBC4724AA00D50.1.1.1.1.1.1.1.1.1',
    'pragma': 'no-cache',
    'referer': 'https://www.fifacm.com/',
    'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
}

params = {
    'term': 'messi',
}


req_list = []
with open('cluster_list.txt', 'r', encoding='UTF-8') as f:
    for line in f:
        
        line = line.strip()
        # skip the first line
        if line == 'PID,name,overall,age,wage_eur,value_eur,diving,handling,kicking,positioning,reflexes,speed,Cluster':
            continue
        # create a dictionary for each line
        cluster_dict = {}
        # split the line into a list
        line_list = line.split(',')
        playerName = line_list[1]

        # if playerName has '. ' in it, replace it with a space
        if ' ' in playerName:
            playerName = playerName.split(' ')
            playerName = playerName[len(playerName)-1]

        
        url = 'https://www.fifacm.com/api/search?term=' + playerName
        
        
        driver.get(url)
        # do this in parallel

        # get the response from driver
        # response = driver.find_element_by_tag_name('pre').text
        response = driver.find_element(By.TAG_NAME, 'pre').text
        # convert the response to a dictionary
        response_dict = eval(response)
        # get the player id
        try:
            if(len(response_dict) > 0):
                player_img = response_dict[0]['pimg']
            else:
                player_img = 'https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png'
        except:
            player_img = 'https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png'
       
        line = line + ',' + player_img

        # write the line to a new file
        with open('cluster_list_with_portraits.txt', 'a', encoding='UTF-8') as f:
            f.write(line + '\n')
        
        # wait some time as to not overload the server
        # time.sleep(1)

driver.close()