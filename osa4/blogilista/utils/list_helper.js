const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const highestLikes = blogs
        .reduce(
            (highest, blog) =>
                highest.likes > blog.likes
                    ? highest
                    : blog
        )

    const favoriteBlog = {
        title: highestLikes.title,
        author: highestLikes.author,
        likes: highestLikes.likes
    }

    return favoriteBlog
}

const mostBlogs = (blogs) => {
    const countAuthors = lodash.countBy(blogs, blog => blog.author)
    const pairAuthors = lodash.toPairs(countAuthors)
    const lastAuthor = lodash.last(pairAuthors)

    const mostBlogs = {
        author: lastAuthor[0],
        blogs: lastAuthor[1]
    }
    
    return mostBlogs
}

const mostLikes = (blogs) => {
    const authorsWithTotalLikes = []
    const groupAuthors = lodash.groupBy(blogs, blog => blog.author)

    lodash.forEach(groupAuthors, (value, key) => {
        authorsWithTotalLikes.push({
            author: key,
            likes: lodash.sumBy(value, 'likes')
        })
    })

    const authorMaxLikes = lodash.maxBy(authorsWithTotalLikes, 'likes')

    const mostLikes = {
        author: authorMaxLikes.author,
        likes: authorMaxLikes.likes
    }

    return mostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}