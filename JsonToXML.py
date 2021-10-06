import dicttoxml
import json

with open('OpenDay.json') as f:
    url = json.load(f)
    

xml = dicttoxml.dicttoxml(url)
print(xml)


f = open("OpenDay.xml", "w")
f.write(xml.decode("utf-8") )
f.close()