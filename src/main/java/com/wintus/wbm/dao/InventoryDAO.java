package com.wintus.wbm.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

public interface InventoryDAO {
	public List<Map<String,Object>> selectInventoryInfo() throws DataAccessException;
	public Map<String,Object> selectDetailInventoryInfo(int paramData) throws DataAccessException;
	public int saveInventoryInfo(Map<String,Object> paramData) throws DataAccessException;
	public int deleteInventoryInfo(int paramData) throws DataAccessException;
	
	public List<Map<String,Object>> selectInventorySubInfo(Map<String,Object> paramData) throws DataAccessException;	
	public Map<String,Object> selectDetailInventorySubInfo(int paramData) throws DataAccessException;
	public int saveInventorySubInfo(Map<String,Object> paramData) throws DataAccessException;
	public int deleteInventorySubInfo(int paramData) throws DataAccessException;
	public Map<String,Integer> selectInventoryCount(int paramData) throws DataAccessException;
}	 

