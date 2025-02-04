package com.wintus.wbm.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

public interface SettingDAO {
	public List<Map<String,Object>> selectManagerInfo(Map<String,Object> paramData) throws DataAccessException;
	public Map<String,Object> selectDetailUserInfo(int paramData) throws DataAccessException;
	public int saveUserInfo(Map<String,Object> paramData) throws DataAccessException;
	public int deleteUserInfo(int paramData) throws DataAccessException;
	public int saveSalesTypeInfo(Map<String,Object> paramData) throws DataAccessException;
	public List<Map<String, Object>> selectSalesTypeData() throws DataAccessException;
	public Map<String, Object> selectDetailSalesTypeInfo(int paramData) throws DataAccessException;
	public int deleteSalesTypeInfo(int paramData) throws DataAccessException;
	public int saveContractCompanyInfo(Map<String,Object> paramData) throws DataAccessException;
	public List<Map<String, Object>> selectContractCompanyInfo() throws DataAccessException;
	public Map<String, Object> selectDetailContractCompanyInfo(int paramData) throws DataAccessException;
	public int deleteContractCompanyInfo(int paramData) throws DataAccessException;
}	 

