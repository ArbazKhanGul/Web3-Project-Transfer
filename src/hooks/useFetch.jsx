import { useEffect, useState } from "react";

const APIKEY = process.env.REACT_APP_API_URL;

const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
        // console.log(`https://api.giphy.com/v1/gifs/search?api_key=bEDYWzir9ktvXTkGNP9djOa71i1mqgQY&q=${keyword.split(" ").join("")}&limit=1`);
      let ch=keyword.split(" ")[0];
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=bEDYWzir9ktvXTkGNP9djOa71i1mqgQY&q=${ch}&limit=1`);
      const { data } = await response.json();
 
      let res="";
      if(data[0]?.images?.downsized_medium.url)
      {
          res=data[0]?.images?.downsized_medium.url;
      }
      else
      {
          res="https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif";
      }

      setGifUrl(res);
    } catch (error) {
      setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;