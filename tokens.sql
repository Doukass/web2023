

--insert into monthly score the score

DELIMITER //
CREATE EVENT IF NOT EXISTS calculate_monthly_score
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
  -- Create or update the monthly_score table based on the score table
  INSERT INTO `monthly_score` (`user_id`, `points`)
  SELECT `user_id`, SUM(`points`)
  FROM `score`
  WHERE DATE_FORMAT(`date`, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')
  GROUP BY `user_id`
  ON DUPLICATE KEY UPDATE `points` = VALUES(`points`);
END;
//
DELIMITER ;




--clear the score table 


DELIMITER //
CREATE EVENT IF NOT EXISTS clear_score_table
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
  -- Delete all records from the score table
  DELETE FROM `score`;
END;
//
DELIMITER ;



BEGIN
  DECLARE total_users INT;
  DECLARE total_tokens_to_give INT;
  DECLARE total_tokens_to_give_all INT;
  DECLARE total_users_to_monthly_score INT;
  
  -- Calculate the total number of users
  SELECT COUNT(*) INTO total_users FROM users;
  SELECT COUNT(*) INTO total_users_to_monthly_score FROM monthly_score;
  
  -- Calculate the total tokens to give
  SET total_tokens_to_give = total_users * 80;
  
  -- Calculate the total tokens to give for all users
  SET total_tokens_to_give_all = total_users * 20;
  
  -- Update the tokens table
  INSERT INTO tokens (user_id, total_tokens, token_last_month)
  SELECT m.user_id, (m.points * 80 / total_users), 0
  FROM monthly_score m
  ON DUPLICATE KEY UPDATE
    total_tokens = total_tokens + (m.points * 80 / total_users),
    token_last_month = 0;
END





