package com.wintus.wbm.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository("mainDAO")
public class MainDAOImpl implements MainDAO { 
	@Autowired
	private SqlSession sqlSession;	
	private static final Logger logger = LoggerFactory.getLogger(MainDAOImpl.class);
	
	@Override
	public Map<String, Object> selectInitType() throws DataAccessException {
		Map<String,Object> resultData = new HashMap<String, Object>();
		resultData.put("salesType", sqlSession.selectList("mapper.main.select_sales_type"));
		// resultData.put("productCompany", sqlSession.selectList("mapper.main.select_product_company"));
		// resultData.put("workCompany", sqlSession.selectList("mapper.main.select_work_company"));
		return resultData;
	}
	@Override
	public Map<String, Object> selectContractInfo(Map<String, Object> paramData) throws DataAccessException {
		Map<String,Object> resultData = new HashMap<String, Object>();
		if(Integer.parseInt(paramData.get("isRefresh").toString()) == 1) resultData.put("contractDataCount", sqlSession.selectOne("mapper.main.select_contract_datacount", paramData));		
		
		String sortInfo = paramData.get("sortInfo").toString();
		ObjectMapper objMapper = new ObjectMapper();
		List<String> orderBy = null; // (List<String>)paramData.get("sortInfo");
		// List<Map<String>> contractProduct = null;
		try {
			orderBy = objMapper.readValue(sortInfo, new TypeReference<List<String>>() {});
			paramData.put("sortInfo", orderBy);
			// logger.info("paramData #1=" + paramData.toString());
			resultData.put("contractData", sqlSession.selectList("mapper.main.select_contract_data", paramData));
		} catch (JsonProcessingException e) {
			logger.error("Error - SalesInfo data parsing error");						
		}
		return resultData; 
	}
	@Override
	public int saveSalesInfo(Map<String, Object> paramData) throws DataAccessException {
		int resultData = 0;
		int salesCode = Integer.parseInt(paramData.get("salesCode").toString());

		if(salesCode > 0) {
			resultData = sqlSession.update("mapper.main.update_sales_info", paramData);
		// 신규 추가일 경우
		} else{
			resultData = sqlSession.insert("mapper.main.inser_sales_info", paramData);
			if(resultData > 0) salesCode = Integer.parseInt(paramData.get("autoTsiCode").toString());
		}
		return salesCode;
	}
	
	@Override
	public int insertFilesInfo(int parentCode, String parentTblName, List<Map<String, Object>> updateFilesInfo) throws DataAccessException {
		for(Map<String,Object> mapFileData : updateFilesInfo) {
			mapFileData.put("parentCode", parentCode);
			mapFileData.put("targetImgName", mapFileData.get("targetFileName"));
			mapFileData.put("resImgName", mapFileData.get("resFileName"));
			mapFileData.put("parentTblName", parentTblName);
				
			sqlSession.insert("mapper.main.insert_file_info", mapFileData);
		}
		return 0;
	}
	
	@Override
	public Map<String,Object> selectSalesDetail(Map<String,Object> paramData) throws DataAccessException {
		int salesCode = Integer.parseInt(paramData.get("parentCode").toString());
		int loginLevel = Integer.parseInt(paramData.get("userLoginLevel").toString());
		
		if(loginLevel >= 80) {
			if(loginLevel == 80) paramData.put("readLevel", 1);
			else paramData.put("readLevel", 2);
			logger.info("paramData=" + paramData);
			sqlSession.update("mapper.main.update_read_sales", paramData);
		}		
		
		Map<String, Object>resultData = new HashMap<String, Object>();
		resultData.put("detail_data", sqlSession.selectOne("mapper.main.select_sales_detail", salesCode));
		resultData.put("detail_contract_readymoney", sqlSession.selectList("mapper.main.select_contract_readymoney", salesCode));
		resultData.put("detail_pay_company", sqlSession.selectList("mapper.main.select_contract_paycompany", salesCode));
		resultData.put("detail_bill_publication", sqlSession.selectOne("mapper.main.select_billpublication_detail", salesCode));
		
		Map<String, Object> mapParamData = new HashMap<String, Object>();
		mapParamData.put("parentCode", salesCode);
		
		Map<String, Object> resultMap = (Map<String,Object>)resultData.get("detail_data");
		Integer salesLevel = Integer.parseInt(resultMap.get("tsi_confirm_level").toString());
		logger.info("tsi_confirm_level=" + salesLevel);
		mapParamData.put("parentTblName", "tbl_sales_info");
		resultData.put("file_data", sqlSession.selectList("mapper.main.select_file_data", mapParamData));
		
		if(salesLevel != null && salesLevel >= 1) {
			mapParamData.put("parentTblName", "tbl_contract_info");
			resultData.put("file_contract_data", sqlSession.selectList("mapper.main.select_file_data", mapParamData));
			
			try {
				Map<String,Object> getTempBillInfo = (Map<String,Object>)resultData.get("detail_bill_publication");
				Integer billCode = Integer.parseInt(getTempBillInfo.get("tbp_code").toString());
				if(billCode != null && billCode > 0) {
					mapParamData.put("parentCode", billCode);
					mapParamData.put("parentTblName", "tbl_contract_admin");
					resultData.put("file_billpublication_data", sqlSession.selectList("mapper.main.select_file_data", mapParamData));
				}
			} catch (Exception e) {
				// TODO: handle exception
			}
		}
		return resultData;  
	}
	
	@Override
	public int deleteFileInfo(String paramData) throws DataAccessException { 
		List<String> fileCodes = Arrays.asList(paramData.split(","));
		sqlSession.delete("mapper.main.delete_file_code", fileCodes);
		return 0;
	}
	
	@Override
	public int deleteSalesInfo(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.main.delete_sales_info", paramData);
	}
	
	@Override
	public int saveContractInfo(Map<String, Object> paramData) throws DataAccessException {
		int resultData = 0;
		int salesCode = Integer.parseInt(paramData.get("salesCode").toString());

		if(salesCode > 0) {
			resultData = sqlSession.update("mapper.main.update_contract_info", paramData);
		// 신규 추가일 경우
		} else{
			resultData = sqlSession.insert("mapper.main.inser_contract_info", paramData);
			if(resultData > 0) salesCode = Integer.parseInt(paramData.get("autoTsiCode").toString());
		}
		return salesCode;
	}
	@Override
	public int updateSalesDataStep(Map<String, Integer> paramData) throws DataAccessException {
		return sqlSession.update("mapper.main.update_sales_datastep", paramData);
	}
	
	@Override
	public int deleteContractReadyMoney(int paramData) throws DataAccessException {
		return sqlSession.delete("mapper.main.delete_contract_readymoney", paramData);
	}
	@Override
	public int insertContractReadyMoney(Map<String, Object> paramData) throws DataAccessException {		
		return sqlSession.insert("mapper.main.insert_contract_readymoney", paramData);
	}
	
	@Override
	public int deleteContractInfo(int paramData) throws DataAccessException {
		Integer itemCode = sqlSession.selectOne("mapper.main.select_contract_iteminfo", paramData);
		if(itemCode != null && itemCode > 0) sqlSession.delete("mapper.main.delete_contract_iteminfo", itemCode);
		sqlSession.delete("mapper.main.delete_contract_pay", paramData);
		return sqlSession.delete("mapper.main.delete_contract_info", paramData);
	}
	@Override
	public int savePayBiilInfo(Map<String, Object> paramData) throws DataAccessException {
		int resultData = 0;
		int billCode = Integer.parseInt(paramData.get("billCode").toString());

		if(billCode > 0) {
			resultData = sqlSession.update("mapper.main.update_bill_publication", paramData);
		// 신규 추가일 경우
		} else{
			resultData = sqlSession.insert("mapper.main.insert_bill_publication", paramData);
			if(resultData > 0) resultData = Integer.parseInt(paramData.get("autoTbpCode").toString());
		}
		return resultData;
	}
	
	@Override
	public Map<String, Object> selectPurchaseItemInfo() throws DataAccessException {
		Map<String, Object>resultData = new HashMap<String, Object>();
		resultData.put("productCompanyInfo", sqlSession.selectList("mapper.main.select_product_company"));
		resultData.put("productNameInfo", sqlSession.selectList("mapper.main.select_productname_info"));
		resultData.put("workCompanyInfo", sqlSession.selectList("mapper.main.select_work_company"));
		resultData.put("workNameInfo", sqlSession.selectList("mapper.main.select_workname_info"));
		return resultData;
	}
	
	@Override
	public List<Map<String,Object>> selectProductInfo(int paramData) throws DataAccessException {
		return sqlSession.selectList("mapper.main.select_product_info", paramData);  
	}
	@Override
	public Map<String,Object> selectProductDetail(int paramData) throws DataAccessException {
		Map<String, Object> mapParamData = new HashMap<String, Object>();
		
		Map<String, Object>resultData = new HashMap<String, Object>();
		resultData.put("detail_productdata", sqlSession.selectList("mapper.main.select_product_detail", paramData));
		mapParamData.put("parentCode", paramData);
		mapParamData.put("parentTblName", "tbl_purchase_product");
		resultData.put("file_product_data", sqlSession.selectList("mapper.main.select_file_data", mapParamData));
		return resultData;  
	}
	
	@Override
	public List<Map<String, Object>> selectContractFileInfo(int paramData) throws DataAccessException {
		Map<String,Object> mapFileInfo = new HashMap<String, Object>();
		mapFileInfo.put("parentCode", paramData);
		mapFileInfo.put("parentTblName", "tbl_purchase_info");
		return sqlSession.selectList("mapper.main.select_file_data", mapFileInfo);  
	}
	
	@Override
	public List<Map<String, Object>> selectWorkInfo(int paramData) throws DataAccessException {
		return sqlSession.selectList("mapper.main.select_work_info", paramData);  
	}
	
	@Override
	public Map<String, Object> selectWorkDetail(int paramData) throws DataAccessException {
		Map<String, Object>resultData = new HashMap<String, Object>();
		resultData.put("detail_workdata", sqlSession.selectList("mapper.main.select_work_detail", paramData));

		Map<String, Object> mapParamData = new HashMap<String, Object>();
		mapParamData.put("parentCode", paramData);
		mapParamData.put("parentTblName", "tbl_install_work");
		resultData.put("file_work_data", sqlSession.selectList("mapper.main.select_file_data", mapParamData));
		return resultData;  
	}
	@Override
	public Map<String, Object> selectRevenueInfo(Map<String, Object> paramData) throws DataAccessException {
		Map<String,Object> resultData = new HashMap<String, Object>();
		if(Integer.parseInt(paramData.get("isRefresh").toString()) == 1) resultData.put("resultCount", sqlSession.selectOne("mapper.main.select_revenue_count", paramData));
		
		String sortInfo = paramData.get("sortInfo").toString();
		ObjectMapper objMapper = new ObjectMapper();
		List<String> orderBy = null; // (List<String>)paramData.get("sortInfo");
		// List<Map<String>> contractProduct = null;
		try {
			orderBy = objMapper.readValue(sortInfo, new TypeReference<List<String>>() {});
			paramData.put("sortInfo", orderBy);
			resultData.put("resultData", sqlSession.selectList("mapper.main.select_revenue_data", paramData));
		} catch (JsonProcessingException e) {
			logger.error("Error - ContractProduct data parsing error");						
		}	
		return resultData;
	}
	
	@Override
	public int savePurchaseInfo(Map<String, Object> paramData) throws DataAccessException {
		int resultData = 0;
		int contractCode = Integer.parseInt(paramData.get("contractCode").toString());
		int newContractCode = contractCode;
		if(contractCode <= 0) {
			// 신규 추가일 경우
			resultData = sqlSession.insert("mapper.main.insert_contract_purchaseinfo", paramData);
			if(resultData > 0) newContractCode = Integer.parseInt(paramData.get("autoTciCode").toString());
		} else { 
			resultData = sqlSession.update("mapper.main.update_contract_purchaseinfo", paramData);
		}
		if(newContractCode > 0) {
			sqlSession.delete("mapper.main.delete_contract_items", newContractCode);
		}
		return newContractCode; 
	}
	@Override
	public int insertContractProductInfo(Map<String, Object> paramData) throws DataAccessException { 
		/*
		String productCompany = paramData.get("productCompany").toString();
		Integer companyCode = 0;
		if(productCompany != null && !productCompany.isEmpty()) {
			companyCode = sqlSession.selectOne("mapper.main.select_exist_productcompany", productCompany);
			if(companyCode == null || companyCode <= 0) {
				Map<String,Object> argData = new HashMap<String, Object>();
				argData.put("productComapny", productCompany);
				int resultVal = sqlSession.insert("mapper.main.insert_product_company", argData);
				if(resultVal > 0) companyCode = Integer.parseInt(argData.get("autoTpcCode").toString());
			}
		}
		Integer productCode = 0;
		String productName = paramData.get("productName").toString();
		if(productName != null && !productName.isEmpty()) {
			productCode = sqlSession.selectOne("mapper.main.select_exist_productname", productName);
			if(productCode == null || productCode <= 0) {
				Map<String,Object> argData = new HashMap<String, Object>();
				argData.put("productName", productCompany);
				int resultVal = sqlSession.insert("mapper.main.insert_product_name", argData);
				if(resultVal > 0) productCode = Integer.parseInt(argData.get("autoTpiCode").toString());
			}
		}
		// sqlSession.delete("mapper.main.delete_sales_produceinfo", paramData.get("salesCode").toString());
		paramData.put("companyCode", companyCode);
		paramData.put("productCode", productCode);
		*/
		paramData.put("productPrice", paramData.get("productPrice").toString().replace(",",  ""));
		paramData.put("productPriceVat", paramData.get("productPriceVat").toString().replace(",",  ""));
		return sqlSession.insert("mapper.main.insert_contract_product", paramData);
	}
	
	@Override
	public int insertContractWorkInfo(Map<String, Object> paramData) throws DataAccessException {
		/*
		String workCompany = paramData.get("workCompany").toString();
		Integer companyCode = 0;
		if(workCompany != null && !workCompany.isEmpty()) {
			companyCode = sqlSession.selectOne("mapper.main.select_exist_workcompany", workCompany);
			if(companyCode == null || companyCode <= 0) {
				Map<String,Object> argData = new HashMap<String, Object>();
				argData.put("workCompany", workCompany);
				int resultVal = sqlSession.insert("mapper.main.insert_work_company", argData);
				if(resultVal > 0) companyCode = Integer.parseInt(argData.get("autoTwcCode").toString());
			}
		}
		Integer workCode = 0;
		String workName = paramData.get("workName").toString();
		if(workName != null && !workName.isEmpty()) {
			workCode = sqlSession.selectOne("mapper.main.select_exist_workname", workName);
			if(workCode == null || workCode <= 0) {
				Map<String,Object> argData = new HashMap<String, Object>();
				argData.put("workName", workCompany);
				int resultVal = sqlSession.insert("mapper.main.insert_work_name", argData);
				if(resultVal > 0) workCode = Integer.parseInt(argData.get("autoTwiCode").toString()); 
			}
		}
		// sqlSession.delete("mapper.main.delete_sales_installworkinfo", paramData.get("salesCode").toString());
		paramData.put("companyCode", companyCode);
		paramData.put("workCode", workCode);
		*/
		paramData.put("workPrice", paramData.get("workPrice").toString().replace(",",  ""));
		paramData.put("workPriceVat", paramData.get("workPriceVat").toString().replace(",",  ""));
		return sqlSession.insert("mapper.main.insert_contract_work", paramData);
	}
	
	@Override
	public int deletePurchaseWorkInfo(int paramData) throws DataAccessException {
		sqlSession.delete("mapper.main.delete_sales_produceinfo", paramData);
		sqlSession.delete("mapper.main.delete_sales_installworkinfo", paramData);
		return 1;
	}
	
	@Override
	public int deleteAllPurchaseWorkInfo(int paramData) throws DataAccessException {
		deletePurchaseWorkInfo(paramData);
		Map<String,Object> mapData = new HashMap<String, Object>();
		mapData.put("parentTblName", "tbl_purchase_info");
		mapData.put("parentCode", paramData);
		sqlSession.delete("mapper.main.delete_file_info", mapData);
	
		return 1;
	}
	
	@Override
	public List<Map<String, Object>> selectPayCompanyInfo() throws DataAccessException {
		return sqlSession.selectList("mapper.main.select_contract_paycompany");
	}
	
	@Override
	public Map<String,Object> selectContractDetailInfo(int paramData) throws DataAccessException {
		return sqlSession.selectOne("mapper.main.select_contract_detailinfo", paramData);  
	}
	
	@Override
	public int updateConfirmLevels(Map<String,Integer> paramData) throws DataAccessException {
		return sqlSession.update("mapper.main.update_confirm_level", paramData);
	}
}
