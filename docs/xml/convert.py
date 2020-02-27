import xml.etree.ElementTree as ET 

tree = ET.parse('country_data.xml')
root = tree.getroot()
doc = 'test.csv'

i = tree.iter()
head = []
data = []
text = []
for x in i:
	head.append(x.tag)
	data.append(x.attrib)
	text.append(x.text)

#for x, y, z in zip(head, data, text):
#    print(x, y, z)

for x in data:
	for y in x:
		print(y, x[y])



#for x in root:
#	print(x.tag, x.attrib)

