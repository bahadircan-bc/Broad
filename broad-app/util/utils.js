import { CommonActions, StackActions } from "@react-navigation/native";

export const google_api_key = 'AIzaSyDEcBXKRUuR8cnXmiMAjTSolIUaEIAdols'

export const api_endpoint = 'http://127.0.0.1:8000/'
export let csrftoken = ' '
export function setCsrfToken(newToken) {
  csrftoken = newToken;
}
export async function renewCSRFToken(){
  await fetch(`${api_endpoint}csrftoken/`)
    .then(response => response.json())
    .then(data => {
      setCsrfToken(data.csrfToken);
    })
}

export function validatePassword(password) {
    return String(password)
      .match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
      );
  };

export function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  export function formatDate(dateStr) {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch (error) {
      if (!(error instanceof TypeError))
      console.log(error)
    }
  }

  export  function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
  }

  export function resetStackStates(navigation){
    navigation.dispatch((state)=>{
      state.routes.forEach((element)=>{
        delete element['state'];
      })
    });
  }

  export const turkeyCities = [
        'Adana',
        'Adıyaman',
        'Afyonkarahisar',
        'Ağrı',
        'Amasya',
        'Ankara',
        'Antalya',
        'Artvin',
        'Aydın',
        'Balıkesir',
        'Bilecik',
        'Bingöl',
        'Bitlis',
        'Bolu',
        'Burdur',
        'Bursa',
        'Çanakkale',
        'Çankırı',
        'Çorum',
        'Denizli',
        'Diyarbakir',
        'Edirne',
        'Elazığ',
        'Erzincan',
        'Erzurum',
        'Eskişehir',
        'Gaziantep',
        'Giresun',
        'Gümüşhane',
        'Hakkari',
        'Hatay',
        'Isparta',
        'Mersin',
        'İstanbul',
        'İzmir',
        'Kars',
        'Kastamonu',
        'Kayseri',
        'Kırklareli',
        'Kırşehir',
        'Kocaeli',
        'Konya',
        'Kütahya',
        'Malatya',
        'Manisa',
        'Kahramanmaraş',
        'Mardin',
        'Muğla',
        'Muş',
        'Nevşehir',
        'Niğde',
        'Ordu',
        'Rize',
        'Sakarya',
        'Samsun',
        'Siirt',
        'Sinop',
        'Sivas',
        'Tekirdağ',
        'Tokat',
        'Trabzon',
        'Tunceli',
        'Şanlıurfa',
        'Uşak',
        'Van',
        'Yozgat',
        'Zonguldak',
        'Aksaray',
        'Bayburt',
        'Karaman',
        'Kırıkkale',
        'Batman',
        'Şırnak',
        'Bartın',
        'Ardahan',
        'Iğdır',
        'Yalova',
        'Karabük',
        'Kilis',
        'Osmaniye',
        'Düzce'
  ]