import { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext({});

export function FavoritesProvider({ children }) {
  const fav_posts_key = "favCoomerPosts";
  const [favoritedPosts, setFavoritedPosts] = useState([]);

  useEffect(() => {
      const posts = getFavPosts();
      console.log(posts)
    setFavoritedPosts(posts);
  }, []);
    
  const getFavPosts = () => {
    const jsonValue = localStorage.getItem(fav_posts_key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
};


function isFavoritedPost(post) {
    return favoritedPosts.some((u) => u.id === post.id);
}

const addFavPost = (post) => {
    const favPosts = getFavPosts();

    const existing = favPosts.find((u) => u.id === post.id);
    if (!existing) {
        favPosts.push({ ...post, favDate: new Date() });
        localStorage.setItem(fav_posts_key, JSON.stringify(favPosts));
    }
};

const deleteFavPost = (post) => {
    let favPosts = getFavPosts();
    favPosts = favPosts.filter((u) => u.id !== post.id);
    localStorage.setItem(fav_posts_key, JSON.stringify(favPosts));
};
    
  const handleToggleFavorite = (post) => {
    if (isFavoritedPost(post)) {
        deleteFavPost(post);
    } else {
        addFavPost(post);
    }
    setFavoritedPosts(prevItems => {
        if (isFavoritedPost(post)) {
            return prevItems.filter(u => u.id !== post.id);
        } else {
            return [...prevItems, post];
        }
    });  }

  return (
    <FavoritesContext.Provider 
      value={{
        favoritedPosts, 
        handleToggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )

}