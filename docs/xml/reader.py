import xml.etree.ElementTree as ET 

tree = ET.parse('country_data.xml')
root = tree.getroot()

print(root)

i = tree.getiterator()
c = root.getchildren()
tags = ''
kids = ''
for x in i:
	tags += x.tag + '\n'
for a in c:
	kids += x.tag + ','
print(tags)
