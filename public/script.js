{// function antiga Mask
  // const input = document.querySelector('input[name="price"]');

  // input.addEventListener("keydown", function(e){//pegando o evento


  //     setTimeout(function(){

  //         let {value} = e.target 

  //         value = value.replace(/\D/g,"");

  //         value = new Intl.NumberFormat('pt-BR',{
  //             style: 'currency',//1.000,00
  //             currency:'BRL'
  //         }).format(value/100)


  //         e.target.value = value
  //     },1)
  // });
}

{// funções teste de eventos
  /* const input = document.querySelector('input[name="price"]');
  
  input.addEventListener("keydown", function(e){//pegando o evento
  
  let {value} = e.target
  console.log(value)
  }); */
}

const Mask = {
  apply(input, func) {
    setTimeout(() => {
      input.value = Mask[func](input.value);
    }, 1);
  },

  formatBRL(value) {
    value = value.replace(/\D/g, "");
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  }
}

const PhotosUpload = { 

  input: "", // recebendo input do html com files do array file:[]
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],

  handleFileInput(event) {//02

    const { files: fileList } = event.target
    PhotosUpload.input = event.target //recebendo input do html

    if (PhotosUpload.hasLimit(event)){
      return 
    } 

    Array.from(fileList).forEach((file) => { 

      PhotosUpload.files.push(file); // create  array  files

      const reader = new FileReader() // reader files

      reader.readAsDataURL(file) //pegando arquivos local na máquina

    
      reader.onload = () => {

        const image = new Image(); // <img  /> 

        image.src = String(reader.result);// resultado do carregamento de readAsDataURL()

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      }

      
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles(); // trocando o padrão files
  },
  hasLimit(e) {
    const { uploadLimit,preview } = PhotosUpload
    const { files: fileList } = PhotosUpload.input

    //limitação no upload 
    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      e.prenventDefault(); //bloqueio de arquivos
      return true
    }

    const photoDiv = []; // array de fotos
    preview.childNodes.forEach(function(item) {// cada item, filho dentro preview
      if (item.classList && item.classList.value == "photo") {
        photoDiv.push(item); // add as fotod
      }
    });

   //limit quando for adicionando
    const totalPhotos = fileList.length + photoDiv.length // 
    if (totalPhotos > uploadLimit) { //acima de upload limit
      alert('Você atingiu o limite máximo de fotos');
      event.prenventDefault();
      return true
    }
    return false
  },
  getAllFiles(){// get all file

    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer() //constructor
    //para cada um fils add dataTransfer adicionar no items os arquivos
    PhotosUpload.files.forEach(function(file) { // files do array
      return dataTransfer.items.add(file)
    });

    return dataTransfer.files //retornando os arquivos
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo'); 

    div.onclick = (e) => { return PhotosUpload.removePhoto(e) };// chamando a function para remover a div
    div.appendChild(image) //<div> <image/> </div>
    div.appendChild(PhotosUpload.getRemoveButton()); //element i

    return div
  },
  getRemoveButton() {// criado button

    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = "close"
    return button //

  },
  removePhoto(e) {
    
    const photoDiv = e.target.parentNode //pegando o elemnt pai do <i>, uma acima
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)// pegando indice do click

    //element input
    PhotosUpload.files.splice(index, 1);// tirar posição no array
    //apos tirar o element roda novamente para atualzar input.files 
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]');
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove();
  }




}


const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),

  setImage(e){
    const { target} = e
    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    ImageGallery.highlight.src = target.src
  }
}
