/*
Esta función crea una Orden de Venta en Books al presionar un botón en CRM
Funciona a partir de la integración con Finance (NO CREA CLIENTES EN BOOKS)

La función recibe como argumento el id de la Orden de Venta y lo almacena en orden_id de tipo String

Para usar la función se deben rellenar estas dos variables a continuación
id_organization es un Int y conexion es un String con el nombre de la conexión CRM-Books

*/

id_organization = 0;
conexion = "";

ov_registro = zoho.crm.getRecordById("Sales_Orders",orden_id);
info ov_registro;
detalles = Map();
//Consigo el id del contacto en books
nombre_contacto_crm = ov_registro.get("Account_Name").get("name");
url_contacto = "https://books.zoho.com/api/v3/contacts?organization_id=" + id_organization.toString();
obtenerContactIdBooks = invokeurl
[
    url :url_contacto
    type :GET
    parameters:{"contact_name":nombre_contacto_crm}
    connection:conexion
];
if(obtenerContactIdBooks.get("contacts").isEmpty())
{
    return "Error: No existe Contacto en Books, aguarde a la próxima sincronización (2 horas)";
}
id_contacto_books = obtenerContactIdBooks.get("contacts").get(0).get("contact_id");
detalles.put("customer_id",id_contacto_books);
//Armo JSON de información de productos listados en OV
items_info = List();
for each  producto in ov_registro.get("Product_Details")
{
    linea = Map();
    //Consigo el id del item en books
    url_item = "https://books.zoho.com/api/v3/items?organization_id=" + id_organization.toString();
    obtenerProductIdBooks = invokeurl
    [
        url :url_item
        type :GET
        parameters:{"zcrm_product_id":producto.get("product").get("id")}
        connection:conexion
    ];
    item_id_books = obtenerProductIdBooks.get("items").get(0).get("item_id");
    linea.put("item_id",item_id_books);
    linea.put("quantity",producto.get("quantity"));
    linea.put("discount",producto.get("Discount"));
    items_info.add(linea);
}
detalles.put("line_items",items_info);
//Consigo más datos
detalles.put("crm_owner_id",ov_registro.get("Owner").get("id"));
detalles.put("adjustment",ov_registro.get("Adjustment"));
//Creo un OV en Books
url_ov = "https://books.zoho.com/api/v3/salesorders?organization_id=" + id_organization.toString();
resp = invokeurl
[
    url :url_ov
    type :POST
    parameters:toString(detalles)
    connection:conexion
];
//Muestro cartel anunciando el resultado de la ejecución
if(resp.get("code") == 0)
{
    return "Orden de Venta creada en Zoho Books";
}
else
{
    return "Falla en la creación de la Orden de Venta";
}
