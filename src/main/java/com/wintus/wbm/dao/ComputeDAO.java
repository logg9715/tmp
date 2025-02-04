package com.wintus.wbm.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

public interface ComputeDAO {
	public List<Map<String,Object>> selectComputeInfo(Map<String,Object> paramData) throws DataAccessException;
	public Map<String,Object> selectDetailComputeInfo(int paramData) throws DataAccessException;
	public int saveComputeInfo(Map<String,Object> paramData) throws DataAccessException;
	public int deleteComputeInfo(int paramData) throws DataAccessException;
}	 

