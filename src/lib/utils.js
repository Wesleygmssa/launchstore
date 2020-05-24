
module.exports = {
  
  
  date(timestamp){
    
    const date = new Date(timestamp) 

    //YYYY
    const year = date.getUTCFullYear()

    //mm
    const month = `0${date.getUTCMonth() + 1}`.slice(-2) // 0 à 11 , com + 1 == 0 à  12

    //DD
    const day = `0${date.getUTCDate()}`.slice(-2);
    
    const hour = date.getHours();
    const minutos = date.getMinutes();

    // return yyy-mm-dd
    return {
      day,
      month,
      year,
      hour,
      minutos,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}/${year}`,
      format: `${day}-${year}-${month}`
    } // retornando os formatos

  },



  
  formatPrice(price){
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price/100);
  }

}

  