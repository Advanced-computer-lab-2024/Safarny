// {/*}return (
//     <div className={styles.container}>
//       <header className={styles.header}>
//         <img src={Logo} alt="Safarny Logo" className={styles.logo} />
//         <h1>Safarny</h1>
//         <nav className={styles.nav}>
//           <Link to="/" className={styles.button}>Back to Home</Link>
//         </nav>
//       </header>

// //       <main className={styles.main}>
// //         <h2>Search for Activities or Itineraries</h2>

// //         {error && <p className={styles.errorMessage}>{error}</p>}

// //         <form onSubmit={handleSearch} className={styles.form}>
// //           <label>
// //             Search Query:
// //             <input
// //               type="text"
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               required
// //             />
// //           </label>
// //           <label>
// //             Type:
// //             <select
// //               value={type}
// //               onChange={(e) => setType(e.target.value)}
// //               required
// //             >
// //               <option value="">Select Type</option>
// //               <option value="historical">Historical Places</option>
// //               <option value="activity">Activities</option>
// //               <option value="itinerary">Itineraries</option>
// //             </select>
// //           </label>
// //           <button type="submit" className={styles.button}>
// //             Search
// //           </button>
// //         </form>

//         {results.historicalPlaces && results.historicalPlaces.length > 0 && (
//     <div className={styles.results}>
//         <h3>Search Results:</h3>
//         <ul>
//             {results.historicalPlaces.map(item => (
//                 <li key={item._id} className={styles.resultItem}>
//                     <h4>{item.description}</h4>
//                     {item.pictures && item.pictures.length > 0 && (
//                         <div className={styles.imageContainer}>
//                             {item.pictures.map((pic, index) => (
//                                 <img 
//                                     key={index} 
//                                     src={pic} 
//                                     alt={`Image of ${item.description}`} 
//                                     className={styles.resultImage} 
//                                 />
//                             ))}
//                         </div>
//                     )}
//                     <p>Location: {item.location}</p>
//                     <p>Opening Hours: {item.openingHours}</p>
//                     <p>Ticket Prices: ${item.ticketPrices}</p>
                 
//                 </li>
//             ))}
//         </ul>
//     </div>
// )}

// //         {results.activities.length > 0 && (
// //           <div className={styles.results}>
// //             <h3>Activities Results:</h3>
// //             <ul>
// //               {results.activities.map(item => (
// //                 <li key={item._id}>
// //                   <h4>{item.category}</h4>
// //                   <p>Date: {item.date}</p>
// //                   <p>Time: {item.time}</p>
// //                   <p>Location: {item.location}</p>
// //                   <p>Coordinates: {JSON.stringify(item.coordinates)}</p>
// //                   <p>Price: ${item.price}</p>
// //                   <p>Tags: {item.tags.join(', ')}</p>
// //                   <p>Special Discount: {item.specialDiscount}</p>
// //                   <p>Booking Open: {item.bookingOpen ? 'Yes' : 'No'}</p>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         )}

      
//         {results.itineraries.length > 0 && (
//           <div className={styles.results}>
//             <h3>Itineraries Results:</h3>
//             <ul>
//               {results.itineraries.map(item => (
//                 <li key={item._id}>
//                   <h4>Name: {item.name}</h4>
//                   <p>Description: {item.description}</p>
//                   <p>Date: {new Date(item.date).toLocaleDateString()}</p>
//                   <p>Type: {item.type}</p>
//                   <p>Pick-Up Location: {item.pickUpLocation}</p>
//                   <p>Drop-Off Location: {item.dropOffLocation}</p>
//                   <p>Accessibility: {item.accessibility ? 'Yes' : 'No'}</p>
//                   <p>Price: ${item.price}</p>
//                   <p>Available Dates: {item.availableDates.join(', ')}</p>
//                   <h5>Activities:</h5>
//                   <ul>
//                     {item.activities.map((activity, index) => (
//                       <li key={index}>
//                         <p>Language: {activity.language}</p>
//                         <p>Price: ${activity.price}</p>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )} 
//         {results.historicalPlaces.length === 0 && type === 'historical' && (
//           <p>No historical places found for your search query.</p>
//         )}
        
// //         {results.activities.length === 0 && type === 'activity' && (
// //           <p>No activities found for your search query.</p>
// //         )}

// //         {results.itineraries.length === 0 && type === 'itinerary' && (
// //           <p>No itineraries found for your search query.</p>
// //         )}
// //       </main>

//       <Footer />
//     </div>
//   );
// }; */}
