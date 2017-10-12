# Machool - Start shipping challenge

## Presentation
This project is a NodeJs application that **simulates the process of non-contract shipment with the Canada Post API.** 


## CanadaPost environement
![alt tag](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/images/onestepshipping_workflow_en_2.jpg)

You can find more [information here](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/onestepshipping/default.jsf).

## Preriquisites
- npm
- node

## Commands
In order to start the application, please run the following commands:
```bash
npm i
npm run dev #to start the server
curl -d "./request-body.xml" http://localhost:8080/ #to send post request to server
```
If you want to run the unit test, please run:
```bash
npm run test
```
