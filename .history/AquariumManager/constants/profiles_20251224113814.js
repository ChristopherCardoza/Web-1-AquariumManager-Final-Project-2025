const user1 = {
  id: "user-1",
  username: "AqauriumLover123",
  profilePic: "", // add pic url here later
  tanks: [
    {
      id: "tank-1-1", // might add more tanks later
      name: "My lovely aquarium",
      size: 20,
      temperature: 80,
      ph: 7,
      gh: 6,
      image: "", // put the same tank pic here as what i had for figma
      // add fish
    },
  ],
};

const user2 = {
  id: "user-2",
  username: "GuppyKeeper11",
  profilePic: "", // add pic url here later
  tanks: [
    {
      id: "tank-2-1",
      name: "guppy fry tank",
      size: 10,
      temperature: 80,
      ph: 7.4,
      gh: 6,
      image: "", // put the same tank pic here as what i had for figma
      // add fish
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
