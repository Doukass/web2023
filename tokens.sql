

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
