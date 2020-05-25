
module.exports = {
  
  
  date(timestamp){
    
    const date = new Date(timestamp) 

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2) // 0 à 11 , com + 1 == 0 à  12
    const day = `0${date.getDate()}`.slice(-2);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return {
      day,
      month,
      year,
      hour,
      minutes,
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

  