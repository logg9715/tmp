package com.wintus.wbm.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

public interface MainDAO {
	public Map<String,Object> selectInitType() throws DataAccessException;
	public Map<String,Object> selectContractInfo(Map<String,Object> paramData) throws DataAccessException;
	public int saveSalesInfo(Map<String, Object> paramData) throws DataAccessException;
	public int insertFilesInfo(int parentCode, String parentTblName, List<Map<String, Object>> updateFilesInfo) throws DataAccessException;
	public Map<String,Object> selectSalesDetail(Map<String,Object> paramData) throws DataAccessException;
	public int deleteFileInfo(String paramData) throws DataAccessException;
	public int deleteSalesInfo(int paramData) throws DataAccessException;
	public int saveContractInfo(Map<String, Object> paramData) throws DataAccessException;
	public int updateSalesDataStep(Map<String,Integer> paramData) throws DataAccessException;
	public int insertContractReadyMoney(Map<String,Object> paramData) throws DataAccessException;
	public int deleteContractReadyMoney(int paramData) throws DataAccessException;
	public int deleteContractInfo(int paramData) throws DataAccessException;
	public int savePayBiilInfo(Map<String,Object> paramData) throws DataAccessException;
	public Map<String,Object> selectPurchaseItemInfo() throws DataAccessException;
	public List<Map<String,Object>> selectProductInfo(int paramData) throws DataAccessException;
	public Map<String,Object> selectProductDetail(int paramData) throws DataAccessException;
	public List<Map<String,Object>> selectWorkInfo(int paramData) throws DataAccessException;
	public Map<String,Object> selectWorkDetail(int paramData) throws DataAccessException;
	public Map<String, Object> selectRevenueInfo(Map<String, Object> paramData) throws DataAccessException;
	public int savePurchaseInfo(Map<String, Object> paramData) throws DataAccessException;
	public int insertContractProductInfo(Map<String,Object> paramData) throws DataAccessException;
	public int insertContractWorkInfo(Map<String,Object> paramData) throws DataAccessException;
	public List<Map<String, Object>> selectContractFileInfo(int paramData) throws DataAccessException;
	public List<Map<String, Object>> selectPayCompanyInfo() throws DataAccessException;
	public Map<String,Object> selectContractDetailInfo(int paramData) throws DataAccessException;
	public int updateConfirmLevels(Map<String,Integer> paramData) throws DataAccessException;
	public int deletePurchaseWorkInfo(int paramData) throws DataAccessException;
	public int deleteAllPurchaseWorkInfo(int paramData) throws DataAccessException;
}	 

