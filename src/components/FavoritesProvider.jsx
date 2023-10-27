import { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext({});

export function FavoritesProvider({ children }) {
  const fav_posts_key = "favCoomerPosts";
  const fav_users_key = "favCoomerUsers";

  const [favoritedPosts, setFavoritedPosts] = useState([]);
  const [favoritedUsers, setFavoritedUsers] = useState([]);

  useEffect(() => {
    const posts = getFavPosts();
    const users = getFavUsers();
    console.log(users)

      console.log(posts)
    setFavoritedPosts(posts);
    setFavoritedUsers(users);

  }, []);
    
  const getFavUsers = () => {
    const jsonValue = localStorage.getItem(fav_users_key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
};

  const getFavPosts = () => {
    const jsonValue = localStorage.getItem(fav_posts_key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
};


function isFavoritedUser(user) {
  return favoritedUsers.some((u) => u.id === user.id);
}
  
function isFavoritedPost(post) {
    return favoritedPosts.some((u) => u.id === post.id);
}

const addFavUser = (user) => {
  const favUsers = getFavUsers();

  const existing = favUsers.find((u) => u.id === user.id);
  if (!existing) {
      favUsers.push({ ...user, favDate: new Date() });
      localStorage.setItem(fav_users_key, JSON.stringify(favUsers));
  }
};

const deleteFavUser = (user) => {
  let favUsers = getFavUsers();
  favUsers = favUsers.filter((u) => u.id !== user.id);
  localStorage.setItem(fav_posts_key, JSON.stringify(favUsers));
};
  
  
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
    
  const handleToggleFavoritePost = (post) => {
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
    });
  }
  

  const handleToggleFavoriteUser = (user) => {
    if (isFavoritedUser(user)) {
      deleteFavUser(user);
  } else {
      addFavUser(user);
  }
  setFavoritedUsers(prevItems => {
      if (isFavoritedUser(user)) {
          return prevItems.filter(u => u.id !== user.id);
      } else {
          return [...prevItems, user];
      }
  });  }


  return (
    <FavoritesContext.Provider 
      value={{
        favoritedPosts,
        favoritedUsers,
        handleToggleFavoritePost,
        handleToggleFavoriteUser,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )

}