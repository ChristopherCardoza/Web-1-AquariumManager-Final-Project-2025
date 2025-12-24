const user1 = {
  id: "user-1",
  username: "AqauriumLover123",
  profilePic: "../../public/profile-user1.jpg",
  tanks: [
    {
      id: "tank-1-1",
      name: "My lovely aquarium",
      size: 20,
      temperature: 80,
      ph: 7,
      gh: 6,
      image: "", // put the same tank pic here as what i had for figma
      fish: [
        {
          fishId: 1,
          id: 1,
          name: "betta",
          quantity: 1,
        },
        {
          fishId: 2,
          id: 2,
          name: "guppy",
          quantity: 3,
        },
        {
          fishId: 3,
          id: 3,
          name: "neon tetra",
          quantity: 6,
        },
      ],
    },
  ],
};

const user2 = {
  id: "user-2",
  username: "GuppyKeeper11",
  profilePic: "../../public/profile-user2.jpg",
  tanks: [
    {
      id: "tank-2-1",
      name: "guppy fry tank",
      size: 10,
      temperature: 80,
      ph: 7.4,
      gh: 6,
      image: "", // put the same tank pic here as what i had for figma
      fish: [
        {
          fishId: 2,
          id: 2,
          name: "guppy",
          quantity: 22,
        },
      ],
    },
  ],
};

export { user1, user2 };

export function ProfileById(id) {
  if (id == "user-1") {
    return user1;
  }
  if (id == "user-2") {
    return user2;
  }

  return null;
}
