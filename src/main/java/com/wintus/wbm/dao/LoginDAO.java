package com.wintus.wbm.dao;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

public interface LoginDAO {
	public Map<String, Object> selectLoginCheck(Map<String,Object> paramData) throws DataAccessException;
	public List<Map<String, Object>> selectGroupInfo() throws DataAccessException;
	public int saveJoinInfo(Map<String, Object> paramData) throws DataAccessException;
	public int selectIdOverlapCheck(String paramData) throws DataAccessException;
	public String selectFindPassword(Map<String,String> paramData) throws DataAccessException;
}	 

