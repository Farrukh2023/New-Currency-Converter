import { useEffect, useState } from "react"
import CurrencyDropdown from "./dropdown";
import { HiArrowsRightLeft } from "react-icons/hi2";




const CurrencyConvertor = () => {
  const [currencies, setCurrencies] = useState([])
  const [amount, setamount]=useState(1)

  const [fromCurrency, setfromCurrency] = useState("USD");
  const [toCurrency, settoCurrency] = useState("PKR");
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [converting, setConverting] = useState(false)
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"] )
  //Currencies -> https://api.frankfurter.dev/v1/currencies
  //Currecncies -> https://api.frankfurter.dev/v1/latest?amount=1&from=USD&to=INR

  const fetchCurrencies =async () => {
    try{
      const response = await fetch(`https://api.frankfurter.dev/v1/currencies`)
      const data = await response.json() 

      setCurrencies(Object.keys(data))
    }catch (error){
      console.error("Error Fetching", error)

    }
  }
  useEffect(() =>{
    fetchCurrencies()
  }, [])
  console.log(currencies);

  const convertCurrency = async() => {
    if(!amount)return
    setConverting(true);
    try{
      const response = await fetch(
        `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        )
      const data = await response.json() 

      setConvertedAmount(data.rates[toCurrency]+ " " + toCurrency)
    }catch (error){
      console.error("Error Fetching", error)

    } finally{
      setConverting(false);
    }

  }

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];

    if(favorites.include(currency)){
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency)
    } else{
      updatedFavorites.push(currency)
    }
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const swapCurrencies = ()=> {
    setfromCurrency(toCurrency)
    settoCurrency(fromCurrency)
    setConvertedAmount(null);

  }

  return (
    <div className="max-w-xl mg-auto my-5 p-5 bg-white rounded-lg shadow-md">
      <h2 className="mb-5 text-2xl font-semibold text-gray-700">Currency Converter

      </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <CurrencyDropdown currencies={currencies}
            favorites={favorites} 
            title="From:"
             currency={fromCurrency}
             setCurrency={setfromCurrency}
            handleFavorite={handleFavorite}/>
            {/* swap currency button */}
            <div className="flex justify-center -mb-5 sm:mb-0">
              <button onClick={swapCurrencies} className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300">
                <HiArrowsRightLeft className="text-xl text-gray-700"/>
              </button>
            </div>

             <CurrencyDropdown
             favorites={favorites}
              currencies={currencies}
              currency={toCurrency}
              setCurrency={settoCurrency} 
              title="To:"
              handleFavorite={handleFavorite}
              
              />

            </div>

          <div className="mt-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount: </label>
            <input 
            value={amount}
            onChange={(e) => setamount(e.target.value)}

            type="number" className="w-full p-2 border border-gray-300 rounded-md shadow-md focus:outlined-none focus:ring-2 focus:ring-indigo-300"/>
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={convertCurrency} className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${converting?"animate-pulse" : ""}`}>Convert</button>
          </div>

          {convertedAmount && ( <div className="mt-4 text-md font-medium text-right text-green-600">
            Converted Amount: {convertedAmount}
          </div>
          )}

    </div>
  )
}

export default CurrencyConvertor
