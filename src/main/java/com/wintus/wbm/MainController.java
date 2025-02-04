package com.wintus.wbm;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wintus.wbm.common.AES256; 
import com.wintus.wbm.common.common;
import com.wintus.wbm.dao.MainDAO;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 

/**
 * Handles requests for the application home page.
 */
@Controller("mainController")
@EnableAspectJAutoProxy
public class MainController { 
	@Autowired
	private MainDAO mainDAO;
	
	private static final Logger logger = LoggerFactory.getLogger(MainController.class);
	
	// 관제센터 현황 정보 처음 페이지 로딩 시 처리
	@RequestMapping(value= {"/","main"} ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView main(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ModelAndView mav = new ModelAndView();
		int userLoginCode = common.getSessionLoginCode(request);
		
		/* @@ 로그인 생략 */
		//if(userLoginCode <= 0) {
		if(false) {	
			mav.setViewName("redirect:/login");
		} else {
			mav.addObject("loginLevel", common.getSessionLoginLevel(request));
			mav.addObject("loginName", common.getSessionLoginName(request));
			mav.addObject("loginCode", common.getSessionLoginCode(request));
			mav.addObject("levelName", common.getSessionLevelName(request));
			mav.addObject("groupName", common.getSessionGroupName(request));
			mav.addObject("groupCode", common.getSessionGroupCode(request));
			// logger.info("mav=" + mav.toString());

			String viewName=(String)request.getAttribute("viewName");
			mav.setViewName(viewName);	 
		}
		
		return mav; 
	}
	
	@RequestMapping(value= "revenue" ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView revenue(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ModelAndView mav = new ModelAndView();
		int userLoginCode = common.getSessionLoginCode(request);
		
		if(userLoginCode <= 0) {
			mav.setViewName("redirect:/login");
		} else {
			mav.addObject("loginLevel", common.getSessionLoginLevel(request));
			mav.addObject("loginName", common.getSessionLoginName(request));
			mav.addObject("loginCode", common.getSessionLoginCode(request));
			mav.addObject("levelName", common.getSessionLevelName(request));
			mav.addObject("groupName", common.getSessionGroupName(request));
			mav.addObject("groupCode", common.getSessionGroupCode(request));
			// logger.info("mav=" + mav.toString());
			
			String viewName=(String)request.getAttribute("viewName");
			mav.setViewName(viewName);	 
		}
		
		return mav; 
	}
	
	// 로그아웃
	@RequestMapping(value= "logout" ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView logout(HttpServletRequest request, HttpServletResponse response) throws Exception{		
		common.setSessionLogout(request);
		
		ModelAndView mav = new ModelAndView();
		mav.setViewName("redirect:/login");
		return mav;
	}
	
	// 영업관리 구분 항목 읽어오기
	@RequestMapping(value="listInitType", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listInitType(HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = mainDAO.selectInitType();
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	// 영업관리 및 계약관리정보 읽어옴
	@RequestMapping(value="listContractInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listContractInfo(@RequestParam Map<String,Object> paramData,
			/*
			@RequestParam int searchType,
			@RequestParam String searchData,
			@RequestParam int orderBy,
			@RequestParam int isRefresh,
			@RequestParam int pageIndex,
			@RequestParam int listCount,
			*/
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		int userCode = common.getSessionLoginCode(request);
		int userLevel = common.getSessionLoginLevel(request);
		int groupCode = common.getSessionGroupCode(request);
		
		// Map<String,Object> paramData = new HashMap<String, Object>();
		paramData.put("userCode", userCode);
		paramData.put("userLevel", userLevel);
		paramData.put("groupCode", groupCode);
		/*
		paramData.put("searchType", searchType);
		paramData.put("searchData", searchData);
		paramData.put("orderBy", orderBy);
		paramData.put("isRefresh", isRefresh);
		paramData.put("pageIndex", pageIndex);
		paramData.put("listCount", listCount);		
		*/
		Map<String,Object> resultData = mainDAO.selectContractInfo(paramData);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="saveSalesInfo", method={RequestMethod.POST},produces = "application/text; charset=utf8")
	public @ResponseBody String saveSalesInfo(MultipartHttpServletRequest multipartRequest, HttpServletRequest request, HttpServletResponse response)  throws Exception {
		multipartRequest.setCharacterEncoding("utf-8");
		response.setContentType("text/html; charset=UTF-8");
		
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		int userGroupCode = common.getSessionGroupCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			Map<String,Object> mapParamData = new HashMap<String, Object>();
			Enumeration enu = multipartRequest.getParameterNames();
			while(enu.hasMoreElements()) {
				String name = (String)enu.nextElement();
				String value = multipartRequest.getParameter(name);
				logger.info(name + " : " + value);
				mapParamData.put(name,value);
			}
			mapParamData.put("userCode", userLoginCode);
			mapParamData.put("groupCode", userGroupCode);
			mapParamData.put("salesContractPrice", mapParamData.get("salesContractPrice").toString().replace(",", ""));
			mapParamData.put("salesContractVat", mapParamData.get("salesContractVat").toString().replace(",", ""));
			resultData = mainDAO.saveSalesInfo(mapParamData);
			
			if(mapParamData.get("delFiles") != null && !mapParamData.get("delFiles").toString().equals("")) {
				mainDAO.deleteFileInfo(mapParamData.get("delFiles").toString());
			}
			MultipartFile files = multipartRequest.getFile("businessFileInput");
			if(files != null && files.getSize() > 0) {
				String imageFolderName = mapParamData.get("imgFolderName").toString();
				List<Map<String,Object>> lstUploadFileInfo =  common.fileUploads(multipartRequest, "businessFileInput", imageFolderName);
				logger.info("lstUploadFileInfo.size()=" + lstUploadFileInfo.size());
				if(lstUploadFileInfo.size() > 0) mainDAO.insertFilesInfo(resultData, "tbl_sales_info", lstUploadFileInfo);
			}
		}
		
		logger.info("resultData=" + resultData);
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);
		String jsonInfo = totalObject.toString(); 

		return jsonInfo;
	}
	
	@RequestMapping(value="salesDetailInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String salesDetailInfo(@RequestParam int salesCode,HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String,Object> paramData = new HashMap<String, Object>();
		paramData.put("parentCode", salesCode);
		paramData.put("userLoginLevel", common.getSessionLoginLevel(request));
		Map<String,Object> resultData = mainDAO.selectSalesDetail(paramData);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="/salesDownload", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody void salesDownload(
			@RequestParam String resFileName, 
			@RequestParam String fileName, 
			@RequestParam String imageFolder,  
			HttpServletResponse response) throws Exception {
		common.download(resFileName, fileName, imageFolder, response);		
	}
	
	@RequestMapping(value="removeSalesInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeSalesInfo(@RequestParam int salesCode,HttpServletResponse response) throws Exception {
		int resultData = mainDAO.deleteSalesInfo(salesCode);		
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="saveContractInfo", method={RequestMethod.POST},produces = "application/text; charset=utf8")
	public @ResponseBody String saveContractInfo(MultipartHttpServletRequest multipartRequest, HttpServletRequest request, HttpServletResponse response)  throws Exception {
		multipartRequest.setCharacterEncoding("utf-8");
		response.setContentType("text/html; charset=UTF-8");		
		Map<String,Object> mapParamData = new HashMap<String, Object>();		
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		int userLoginLevel = common.getSessionLoginLevel(request);
		int userGroupCode = common.getSessionGroupCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			Enumeration enu = multipartRequest.getParameterNames();
			while(enu.hasMoreElements()) {
				String name = (String)enu.nextElement();
				String value = multipartRequest.getParameter(name);
				// logger.info(name + " : " + value);
				mapParamData.put(name,value);
			}
			mapParamData.put("userCode", userLoginCode);
			mapParamData.put("groupCode", userGroupCode);
			mapParamData.put("contractPrice", mapParamData.get("contractPrice").toString().replace(",", ""));
			mapParamData.put("contractVat", mapParamData.get("contractVat").toString().replace(",", ""));
//			if(userLoginLevel > 80) mapParamData.put("confirmLevel", 2);
			resultData = mainDAO.saveContractInfo(mapParamData);
			
			if(mapParamData.get("delFiles") != null && !mapParamData.get("delFiles").toString().equals("")) {
				mainDAO.deleteFileInfo(mapParamData.get("delFiles").toString());
			}
			MultipartFile files = multipartRequest.getFile("contract2FileInput");
			if(files != null && files.getSize() > 0) {
				String imageFolderName = mapParamData.get("imgFolderName").toString();
				List<Map<String,Object>> lstUploadFileInfo =  common.fileUploads(multipartRequest, "contract2FileInput", imageFolderName);
				// logger.info("lstUploadFileInfo.size()=" + lstUploadFileInfo.size());
				if(lstUploadFileInfo.size() > 0) mainDAO.insertFilesInfo(resultData, "tbl_contract_info", lstUploadFileInfo);
			}
		}
		if(resultData > 0) {			
			String contractReadyMoneyJson = multipartRequest.getParameter("contractReadyMoney");
			if(contractReadyMoneyJson != null && !contractReadyMoneyJson.equals("") && 
		       !contractReadyMoneyJson.isEmpty() && !contractReadyMoneyJson.equals("[]")) {
				int salesCode = Integer.parseInt(mapParamData.get("salesCode").toString());
				if(salesCode > 0) mainDAO.deleteContractReadyMoney(salesCode);
				
				// logger.info("contractReadyMoneyJson=" + contractReadyMoneyJson);
				ObjectMapper objMapper = new ObjectMapper();
				List<Map<String,Object>> contractReadyMoney = null;
				try {
					contractReadyMoney = objMapper.readValue(contractReadyMoneyJson, new TypeReference<List<Map<String,Object>>>() {});
					for(Map<String,Object> item : contractReadyMoney) {
						item.put("userCode", userLoginCode);
						item.put("contractCode", resultData);
						item.put("payContractPrice", item.get("payContractPrice").toString().replace(",", ""));
						item.put("payContractPriceVat", item.get("payContractPriceVat").toString().replace(",", ""));
//						if(userLoginLevel > 80) item.put("confirmLevel", 2);
						mainDAO.insertContractReadyMoney(item);
					}
				} catch (JsonProcessingException e) {
					logger.error("Error - ReadyMoney data parsing error");
					
				}				
			}
		}
		
		//logger.info("resultData=" + resultData);
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);
		String jsonInfo = totalObject.toString(); 

		return jsonInfo;
	}
	
	@RequestMapping(value="changeSalesDataStep", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String changeSalesDataStep(@RequestParam int salesCode,@RequestParam int level, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String,Integer> mapParamData = new HashMap<String, Integer>();
		mapParamData.put("salesCode", salesCode);
		mapParamData.put("level", level);
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			mapParamData.put("userCode", userLoginCode);
			resultData = mainDAO.updateSalesDataStep(mapParamData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);   
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="removeContractInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeContractInfo(@RequestParam int salesCode,HttpServletResponse response) throws Exception {
		int resultData = mainDAO.deleteContractInfo(salesCode);
		logger.info("salesCode=" + resultData);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="purchaseItemInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String purchaseItemInfo(HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = mainDAO.selectPurchaseItemInfo();
		logger.info("salesCode=" + resultData);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="changePayBillInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String changePayBillInfo(
		/*
		@RequestParam int payCompanyCode,
		@RequestParam int payBillType,
		@RequestParam int payCollect,
		@RequestParam String contractResponseBillDate,
		@RequestParam String contractMemo,
		@RequestParam int payCode,
		*/
		MultipartHttpServletRequest multipartRequest, 
		HttpServletRequest request,
		HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			Map<String,Object> mapParamData = new HashMap<String, Object>();		
			Enumeration enu = multipartRequest.getParameterNames();
			while(enu.hasMoreElements()) {
				String name = (String)enu.nextElement();
				if(name.equals("productInfo")) continue;
				
				String value = multipartRequest.getParameter(name);
				logger.info(name + " : " + value);
				mapParamData.put(name,value);
			}
			/*
			Map<String,Object> mapParamData = new HashMap<String, Object>();
			mapParamData.put("payCompanyCode", payCompanyCode);
			mapParamData.put("payBillType", payBillType);
			mapParamData.put("payCollect", payCollect);
			mapParamData.put("contractResponseBillDate", contractResponseBillDate);
			mapParamData.put("contractMemo", contractMemo);
			mapParamData.put("payCode", payCode);
			*/
			if(mapParamData.get("payCollect") == null) mapParamData.put("payCollect", 0);
			if(mapParamData.get("billType") == null) mapParamData.put("billType", 0);
			mapParamData.put("userCode", userLoginCode);
			resultData = mainDAO.savePayBiilInfo(mapParamData);		
			if(resultData > 0) {
				if(mapParamData.get("delFiles") != null && !mapParamData.get("delFiles").toString().equals("")) {
					mainDAO.deleteFileInfo(mapParamData.get("delFiles").toString());
				}
				MultipartFile files = multipartRequest.getFile("contractAdminFileInput");
				if(files != null && files.getSize() > 0) {
					String imageFolderName = mapParamData.get("imgFolderName").toString();
					List<Map<String,Object>> lstUploadFileInfo =  common.fileUploads(multipartRequest, "contractAdminFileInput", imageFolderName);
					logger.info("lstUploadFileInfo.size()=" + lstUploadFileInfo.size());
					if(lstUploadFileInfo.size() > 0) mainDAO.insertFilesInfo(resultData, "tbl_contract_admin", lstUploadFileInfo);
				}
			}
		}		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="productInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String productInfo(@RequestParam int salesCode,HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = mainDAO.selectProductInfo(salesCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="productDetailInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String productDetailInfo(@RequestParam int productCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = mainDAO.selectProductDetail(productCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="workInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String workInfo(@RequestParam int salesCode,HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = mainDAO.selectWorkInfo(salesCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="contractFileInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String contractFileInfo(@RequestParam int salesCode,HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = mainDAO.selectContractFileInfo(salesCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="workDetailInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String workDetailInfo(@RequestParam int workCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = mainDAO.selectWorkDetail(workCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="deletePurchaseInfo", method={RequestMethod.POST},produces = "application/text; charset=utf8")
	public @ResponseBody String deletePurchaseInfo(@RequestParam int salesCode, HttpServletRequest request, HttpServletResponse response)  throws Exception {
		int resultData = 1;
		mainDAO.deleteAllPurchaseWorkInfo(salesCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);
		String jsonInfo = totalObject.toString(); 		
		return jsonInfo;
	}
	
	@RequestMapping(value="savePurchaseInfo", method={RequestMethod.POST},produces = "application/text; charset=utf8")
	public @ResponseBody String savePurchaseInfo(MultipartHttpServletRequest multipartRequest, HttpServletRequest request, HttpServletResponse response)  throws Exception {
		multipartRequest.setCharacterEncoding("utf-8");
		response.setContentType("text/html; charset=UTF-8");		
		int resultData = 0;
		boolean execProduct = true;
		boolean execWork = true;
		int userLoginCode = common.getSessionLoginCode(request);
		int userGroupCode = common.getSessionGroupCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			Map<String,Object> mapParamData = new HashMap<String, Object>();		
			Enumeration enu = multipartRequest.getParameterNames();
			while(enu.hasMoreElements()) {
				String name = (String)enu.nextElement();
				if(name.equals("productInfo")) continue;
				
				String value = multipartRequest.getParameter(name);
				logger.info(name + " : " + value);
				mapParamData.put(name,value);
			}
			mapParamData.put("userCode", userLoginCode);
			mapParamData.put("userGroupCode", userGroupCode);
			int salesCode = Integer.parseInt(mapParamData.get("salesCode").toString());
			// resultData = mainDAO.savePurchaseInfo(mapParamData);
			// if(resultData > 0) {
			
			mainDAO.deletePurchaseWorkInfo(salesCode);
			String contractProductInfo = multipartRequest.getParameter("productInfo");
			if(contractProductInfo != null && !contractProductInfo.equals("") && 
		       !contractProductInfo.isEmpty() && !contractProductInfo.equals("[]")) {
				// logger.info("contractProductInfo=" + contractProductInfo);
				ObjectMapper objMapper = new ObjectMapper();
				List<Map<String,Object>> contractProduct = null;
				try {
					contractProduct = objMapper.readValue(contractProductInfo, new TypeReference<List<Map<String,Object>>>() {});
					for(Map<String,Object> item : contractProduct) {
						item.put("salesCode", salesCode);
						int result = mainDAO.insertContractProductInfo(item);
						if(result <= 0) execProduct = false;
					}
				} catch (JsonProcessingException e) {
					logger.error("Error - ContractProduct data parsing error");						
				}				
			}
				
			String contractWorkInfo = multipartRequest.getParameter("workInfo");
			if(contractWorkInfo != null && !contractWorkInfo.equals("") && 
					!contractWorkInfo.isEmpty() && !contractWorkInfo.equals("[]")) {
				// logger.info("contractWorkInfo=" + contractWorkInfo);
				ObjectMapper objMapper = new ObjectMapper();
				List<Map<String,Object>> contractWork = null;
				try {
					contractWork = objMapper.readValue(contractWorkInfo, new TypeReference<List<Map<String,Object>>>() {});
					for(Map<String,Object> item : contractWork) {
						item.put("salesCode", salesCode);
						int result = mainDAO.insertContractWorkInfo(item);
						if(result <= 0) execWork = false;
					}
				} catch (JsonProcessingException e) {
					logger.error("Error - ContractWork data parsing error");						
				}				
			}
			if(mapParamData.get("delFiles") != null && !mapParamData.get("delFiles").toString().equals("")) {
				mainDAO.deleteFileInfo(mapParamData.get("delFiles").toString());
			}
			MultipartFile files = multipartRequest.getFile("purchaseFileInput");
			if(files != null && files.getSize() > 0) {
				String imageFolderName = mapParamData.get("imgFolderName").toString();
				List<Map<String,Object>> lstUploadFileInfo =  common.fileUploads(multipartRequest, "purchaseFileInput", imageFolderName);
				// logger.info("lstUploadFileInfo.size()=" + lstUploadFileInfo.size());
				if(lstUploadFileInfo.size() > 0) mainDAO.insertFilesInfo(salesCode, "tbl_purchase_info", lstUploadFileInfo);
			}
		}
		if(execProduct && execWork) resultData = 1;
		else if(!execProduct && execWork) resultData = -1;
		else if(execProduct && !execWork) resultData = -2;
		else resultData = -3;
	
		logger.info("resultData=" + resultData);
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", 1);
		String jsonInfo = totalObject.toString(); 

		return jsonInfo;
	}
	
	// 영업관리 및 계약관리정보 읽어옴
	@RequestMapping(value="listRevenueInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listRevenueInfo(
			@RequestParam Map<String,Object> formData,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		int userLevel = common.getSessionLoginLevel(request);
		int userGroup = common.getSessionGroupCode(request);
		formData.put("userLevel", userLevel);
		formData.put("userGroup", userGroup);
		logger.info("formData=" + formData.toString());
		Map<String,Object> resultData = mainDAO.selectRevenueInfo(formData);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	// 영업관리 및 계약관리정보 읽어옴
	@RequestMapping(value="listPayCompany", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listPayCompany(
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = mainDAO.selectPayCompanyInfo();
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}	
	
	@RequestMapping(value="contractDetailInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String contractDetailInfo(
			@RequestParam int contractCode,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = mainDAO.selectContractDetailInfo(contractCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="changeConfirmLevel", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String changeConfirmLevel(
			@RequestParam String confirmLevels,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		int resultData = 1;
		int userLoginCode = common.getSessionLoginCode(request);
		int userGroupCode = common.getSessionGroupCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			boolean execResult = true;
			if(confirmLevels != null && !confirmLevels.equals("") && 
					!confirmLevels.isEmpty() && !confirmLevels.equals("[]")) {
				logger.info("contractWorkInfo=" + confirmLevels);
				ObjectMapper objMapper = new ObjectMapper();
				List<Map<String,Integer>> confirmLevelsData = null;
				try {
					confirmLevelsData = objMapper.readValue(confirmLevels, new TypeReference<List<Map<String,Integer>>>() {});
					for(Map<String,Integer> item : confirmLevelsData) {
						logger.info("contractWorkInfo #1=" + item);
						int result = mainDAO.updateConfirmLevels(item);
						if(result <= 0) execResult = false;
					}
				} catch (JsonProcessingException e) {
					logger.error("Error - ContractWork data parsing error");						
				}				
			}
			if(!execResult) resultData = -1;
		}
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}	
}
