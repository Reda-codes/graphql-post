export default function DisplayCharacters({ data }) {
  
  return (
    <div className="flex lg:w-10/12 sm:w-full mx-auto flex-wrap justify-between font-mono">
        {
            data.characters.results.map((ch) => (
                <div key={ch.id} className="lg:w-1/4 md:w-1/3  sm:w-1/2">
                    <div className="bg-white rounded-xl p-5 m-5">
                        <img className="rounded-xl pb-4 drop-shadow-2xl" width="400" height="250" alt="location-reference" src={`${ch.image}`} />
                        <h3 >Name: {ch.name}</h3>
                        <p>Species: {ch.species}</p>
                    </div>
                </div>
            ))
        }
    </div>
  );
}
