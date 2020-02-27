import xml.etree.ElementTree as ET 
import csv, lxml
import openpyxl
from bs4 import BeautifulSoup

tree = ET.parse('country_data.xml')
root = tree.getroot()
doc = 'test.csv'

f = open('test.csv', 'w')
cw = csv.writer(f)
i = tree.iter()
head = []
for x in i:
	head.append(x.tag)
with open(doc) as f_input:
    soup = BeautifulSoup(f_input, 'lxml')

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "sheet1"
ws.append(head)
body = head
body = body.remove('data')
for a in soup.find_all(head[0]):
    ws.append(body)

for x in head:
    print(x)        

wb.save(filename="test.csv")
