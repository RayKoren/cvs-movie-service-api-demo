import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type Movie {
    movieId: Int!
    imdbId: String!
    title: String!
    overview: String
    productionCompanies: String
    releaseDate: String
    budget: String
    revenue: Int
    runtime: Float
    language: String
    genres: String
    status: String
    averageRating: Float
  }

  type MovieListItem {
    movieId: Int!
    imdbId: String!
    title: String!
    genres: String
    releaseDate: String
    budget: String
  }

  type Pagination {
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  type MoviePage {
    data: [MovieListItem!]!
    pagination: Pagination!
  }

  type Query {
    movies(page: Int = 1): MoviePage!
    movie(id: Int!): Movie
    moviesByYear(year: Int!, page: Int = 1, sort: String = "asc"): MoviePage!
    moviesByGenre(genre: String!, page: Int = 1): MoviePage!
  }
`;