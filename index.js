const admin = require('./config').admin;
const { v4: uuidv4 } = require('uuid');
const faker = require('faker'); 

const firestore = admin.firestore()

/* 
Call 1
    collection(country).doc(uuid)
   {name, location, president, chairman, employees, uid} -> Only one collection.
    
*/
const createCompany = () => { 
    const companyUid  = uuidv4();

    const companyDetails = { 
        name: faker.name.firstName(), 
        location: faker.address.city(), 
        president: faker.name.firstName(), 
        chairman: faker.name.lastName(), 
        employees: '3000000000', 
        uid: companyUid
    }

    firestore.collection('company').doc(companyUid).set(companyDetails).then((success) => {
        console.log('Created company successfully', success)
    }).catch((error) => { 
        console.log('Error creating the company', error);
    })
}

/*
    Call 2
   collection(president').doc(uuid)    
   passportNo : firstName, lastName, email, phoneNumber, hometown, age, -< 2K items 
*/
const createPresidents = ((uid) => { 
    const passportNo = faker.finance.account();
    const presidentDetails = { 
        firstName: faker.name.firstName(), 
        lastName: faker.name.firstName(), // last names can have weird characters.
        email: faker.name.firstName(), // Avoiding the @ in faker email, 
        phoneNumber:  Math.floor(Math.random() * Math.floor(10)), /// 
        hometown: faker.address.city(), 
        gender: 'No say', 
        age: Math.floor(Math.random() * Math.floor(100)),
    };


    return firestore.collection('president').doc(uid).set({[passportNo] : presidentDetails})
        .then((success) => {
            console.log('Sucess creating president', success);
            return Promise.resolve()
        }).catch((error) => { 
            console.log('Error creating the president', error);
            return Promise.reject()
        });
});

const presidentsBatchWrite = (startIndex, endIndex, ref) => { 
    const batch = firestore.batch(); 
    
    let localEndIndex;

    if (startIndex >= endIndex) {
        return Promise.resolve([]);
      }

      if (endIndex - startIndex <= 500) {
       localEndIndex = endIndex;
      } else {
        localEndIndex = startIndex + 500;
      }

      for (let i = startIndex; i < localEndIndex; i++) {
        const passportNo = faker.finance.account();
        const presidentDetails = { 
            firstName: faker.name.firstName(), 
            lastName: faker.name.firstName(), // last names can have weird characters.
            email: faker.name.firstName(), // Avoiding the @ in faker email, 
            phoneNumber:  Math.floor(Math.random() * Math.floor(10)), /// 
            hometown: faker.address.city(), 
            gender: 'No say', 
            age: Math.floor(Math.random() * Math.floor(100)),
        };
    
        batch.update(ref, { [passportNo]: presidentDetails });
      }

      console.log('Startindex: ', startIndex, 'localEndIndex: ', localEndIndex, 'endIndex: ',endIndex);

      return batch
      .commit()
      .then((success) => {
        console.log('Success with current presidents batch');
        return presidentsBatchWrite(localEndIndex, endIndex, ref)
      })
      .catch(error => {
        console.log('Failure to write president batches', error);  
      });
}

/*
Call 3:
  collection(cities).doc(uuid)    
  name: {mayor, population} -> String - 10K collections 
*/

const createCities = (cityUid) => { 
    const cityName = faker.address.city(); 
    const cityDetails = { 
        mayor: faker.name.firstName(), 
        population: Math.floor(Math.random() * Math.floor(10, 000)),
        cityId: Math.floor(Math.random() * Math.floor(10, 000))
    };

    // Stringify to reduce the sizes of some fields hence put in more entries. 
    const stringiFiedCityDetails = JSON.stringify(cityDetails); 

    return firestore.collection('city').doc(cityUid).set({[cityName] : stringiFiedCityDetails})
        .then((success) => {
            console.log('Sucess creating city', success);
            return Promise.resolve()
        }).catch((error) => { 
            console.log('Error creating the city', error);
            return Promise.reject()
        });
}

const citiesBatchWrite = (startIndex, endIndex, ref) => { 
    const batch = firestore.batch(); 
    
    let localEndIndex;

    if (startIndex >= endIndex) {
        return Promise.resolve([]);
      }

      if (endIndex - startIndex <= 500) {
       localEndIndex = endIndex;
      } else {
        localEndIndex = startIndex + 500;
      }

      for (let i = startIndex; i < localEndIndex; i++) {
        const cityName = faker.address.city();
        const cityDetails = {
            mayor: faker.name.firstName(), 
            population: Math.floor(Math.random() * Math.floor(10000000000000)),
            cityId: Math.floor(Math.random() * Math.floor(10000))
        };

        const stringiFiedCityDetails = JSON.stringify(cityDetails); 
        batch.update(ref, { [cityName]: stringiFiedCityDetails });
      }

      console.log('Startindex: ', startIndex, 'localEndIndex: ', localEndIndex, 'endIndex: ',endIndex);

      return batch
      .commit()
      .then((success) => {
        console.log('Success with current cities batch');
        return citiesBatchWrite(localEndIndex, endIndex, ref)
      })
      .catch(error => {
        console.log('Failure to write batches', error);  
      });
}

 /*
    Call 4:
    collection(countries).doc(uuid)
    uuid, continentUid, developed, indepedenceDate, democratic, cities:  [name, mayor, population ], totalPopulation, president: { firstName, lastName, email, phoneNumber, dateofBirth} -> C
 */
const createCountriesHelper = ((uid) => { 
    const passportNo = faker.finance.account();
    const developed = (Math.floor(Math.random() * Math.floor(2)) === 1);
    const democratic = (Math.floor(Math.random() * Math.floor(2)) === 1);
    const towns = []; 

    for (let i =0; i < 20; i++) { 
        let town = { 
            name: faker.address.city(), 
            mayor: faker.name.firstName(), 
            population:  Math.floor(Math.random() * Math.floor(100000))
        }
        towns.push(town)
    }

    const countryDetails = { 
        countryUid: uid, 
        continentId: uuidv4(), 
        developed, 
        democratic,
        towns,
        indepedenceDate : faker.date.past(), 
        totalPopulation: Math.floor(Math.random() * Math.floor(100000000000)), 
        president: 
        { 
            lastName: faker.name.firstName(), // last names can have weird characters.
            email: faker.name.firstName(), // Avoiding the @ in faker email, 
            phoneNumber:  Math.floor(Math.random() * Math.floor(10)), /// 
            hometown: faker.address.city(), 
            gender: 'No say', 
            age: Math.floor(Math.random() * Math.floor(100)),
        }
    };

    return countryDetails;
});

const countriesBatchWrite = (startIndex, endIndex) => { 
    const batch = firestore.batch(); 
    
    let localEndIndex;

    if (startIndex >= endIndex) {
        return Promise.resolve([]);
      }

      if (endIndex - startIndex <= 500) {
       localEndIndex = endIndex;
      } else {
        localEndIndex = startIndex + 500;
      }

      for (let i = startIndex; i < localEndIndex; i++) {
        const countryUid = uuidv4()
        let CurrentCountry = createCountriesHelper(countryUid)

        let ref =  firestore.collection('countries').doc(countryUid);
        batch.set(ref, { [countryUid]: CurrentCountry });
      }

      console.log('Startindex: ', startIndex, 'localEndIndex: ', localEndIndex, 'endIndex: ',endIndex);

      return batch
      .commit()
      .then((success) => {
        console.log('Success with current countries batch');
        return countriesBatchWrite(localEndIndex, endIndex)
      })
      .catch(error => {
        console.log('Failure to write countries batches', error);  
      });
}

// Create one company 
createCompany();

// Create about 200 presidents
const presidentUid = uuidv4();
createPresidents(presidentUid).then(() => { 
    const ref =  firestore.collection('president').doc(presidentUid)
    presidentsBatchWrite(0, 1010, ref);
})

const cityUid = uuidv4();
// Create an entry first using set then update the doc in batchwrite 
// Set overrides previous entries && update fails if there is not existing entry. 
createCities(cityUid).then(() => { 
    const ref = firestore.collection('city').doc(cityUid)
    citiesBatchWrite(0, 10000, ref);
});

// Create about 200 cities
countriesBatchWrite(0, 200);
 



