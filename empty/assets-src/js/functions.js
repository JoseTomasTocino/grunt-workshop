function getDateAsString()
{
    // Get today's date
    var currentDate = new Date();
    var monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

    return "Hoy es " + currentDate.getDate() +
           " de " + monthNames[currentDate.getMonth() - 1] +
           " de " + currentDate.getFullYear();
}