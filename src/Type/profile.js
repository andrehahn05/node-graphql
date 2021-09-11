const db = require('../database/db')

module.exports = {
  profiles(profile){
    return db('users')
      .join(
        'users_profiles',
        'profiles.id',
        'users_profiles.profile_id'
      )
      .where({user_id:profile.id});
  }
}