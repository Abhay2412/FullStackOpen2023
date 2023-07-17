const RecommendedGenre = ({ show, user, books }) => {
    const favoriteGenre = user ? user.favoriteGenre : null
    if(!show) {
        return null
    }

    const booksToFilter = books.filter(book => book.genres.includes(favoriteGenre))

    return (
        <div>
            <h2>Recommendations</h2>
            <p>These are the following books in your favorite genre {favoriteGenre}</p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>Author</th>
                        <th>Published</th>
                    </tr>
                    {booksToFilter.map((b) => (
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RecommendedGenre