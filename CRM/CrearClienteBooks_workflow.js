/*
Esta función crea un Cliente en Books al crear una Cuenta en CRM.
Se debe crear un Workflow asociado al módulo Cuentas que se ejecute cada vez que se crea una Cuenta nueva, 
y que a su vez se asocie a esta función.

La función recibe como argumento el id de la Cuenta y lo almacena en id_cuenta de tipo Int.

Para usar la función se deben rellenar dos variables:
organization_id que es el id de la organización que se encuantra en Books (tipo Int), 
y el nombre/id de la conexión entre CRM-Books que se debe ingresar en el header connection dentro del invokeurl (dentro de comillas).
*/

organization_id = 737286029;

//Consigo resgitro de Cuenta y lo almaceno en registro_cuenta
registro_cuenta = zoho.crm.getRecordById("Accounts",id_cuenta);
//Creo Mapa con los datos a enviar a Books para crear Cliente
detalles = Map();
detalles.put("contact_name",registro_cuenta.get("Account_Name"));
detalles.put("company_name",registro_cuenta.get("Account_Name"));
detalles.put("currency_code",registro_cuenta.get("Currency"));
//Crear Cliente en Books
tun_url = "https://books.zoho.com/api/v3/contacts?organization_id=" + organization_id.toString();
//Aca pone tu id/nombre de conección de CRM-Books
resp = invokeurl
[
	url :tun_url
	type :POST
	parameters:toString(detalles)
	connection:"conexionbooks"
];
info resp;
