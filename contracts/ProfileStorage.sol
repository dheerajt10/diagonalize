// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProfileStorage
 * @dev A simple contract to store user profile data on-chain.
 * It maps a string key to a user's profile, which includes a username and company.
 */
contract ProfileStorage {

    // Defines the structure for the data we want to store.
    struct Profile {
        string username;
        string company;
    }

    // A mapping from a string key to a Profile struct.
    // 'public' automatically creates a "getter" function.
    // This means you can call `profiles("some_key")` to retrieve the data.
    mapping(string => Profile) public profiles;

    // An event that is emitted whenever a profile is set or updated.
    // This is useful for tracking changes off-chain.
    event ProfileSet(string indexed key, string username, string company);

    /**
     * @dev Stores or updates a user's profile.
     * @param _key The unique key (e.g., a user ID) to store the data under.
     * @param _username The username to store.
     * @param _company The company name to store.
     */
    function setProfile(string memory _key, string memory _username, string memory _company) public {
        // Creates a new Profile struct in memory and assigns it to the mapping.
        profiles[_key] = Profile(_username, _company);

        // Emits an event to log that the data was stored.
        emit ProfileSet(_key, _username, _company);
    }
}
