import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import DisplayCharacters from './components/DisplayCharacters'

function App() {
  let [page, setPage] = useState(1);

  const GET_DATA = gql`
      query {
          characters(page:${page}) {
              info {
              count,
              next
              },
              results {
              id,
              name,
              species,
              image
              }
          }
      }
  `;

  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p className='text-white text-lg font-mono font-bold text-center'>Loading...</p>;
  if (error) return <p>charactersError : {error.message}</p>;
  console.log(data.characters);
  return (
    <>
      <div>
        <h1 className='text-5xl text-center m-5 mb-10 font-bold text-white'>Rick and Morty Characters</h1>
        <DisplayCharacters data={data}/>
      </div>
      <div className='flex justify-center m-10'>
        <div className=''>
              {
                  page === 1 ? '' : <button className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l' onClick={() => {setPage(page-=1)}}>PREV</button>
              }
              {
                  data.characters.info.next ? <button className={page=== 1? 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded': 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r'} onClick={() => {setPage(page+=1)}}>NEXT</button> : ""
              }  
        </div>  
      </div>
    </>
  );
}

export default App;
