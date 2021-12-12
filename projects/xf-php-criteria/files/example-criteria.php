<?php

class Criteria
{
    public static function trophy_AllForOne(\XF\App $app, \XF\Entity\User $user)
    {
        //
        // YOU CUSTOM CRITERIA CODE GOES BELOW
        //

        // Getting the database
        $db = $app->db();

        // Database query for selecting the maximum number of likes for single user post
        $query = "SELECT `likes` FROM `xf_post` WHERE `user_id` = ? ORDER BY `likes` DESC LIMIT 1";

        // Retrieving the maximum number of likes
        $likes = $db->fetchOne($query, [$user->user_id]);

        // Checking that we have a result from database (we do expect a number)
        if(is_int($likes))
        {
            // Returning true if user has a message with 5 or more likes or false if he has not
            return ($likes >= 5);
        }
        else
        {
            return false;
        }
    }
}