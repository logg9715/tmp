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
import com.wintus.wbm.dao.SettingDAO;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 

/**
 * Handles requests for the application home page.
 */
@Controller("settingController")
@EnableAspectJAutoProxy
public class SettingController { 
	@Autowired
	private SettingDAO settingDAO;
	
	private int sessionTmiCode;
	private int m_iLevel;
	
	private static final Logger logger = LoggerFactory.getLogger(SettingController.class);
	
	// 관제센터 현황 정보 처음 페이지 로딩 시 처리
	@RequestMapping(value= "setting" ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView setting(HttpServletRequest request, HttpServletResponse response) throws Exception{
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
	
	@RequestMapping(value="listManagerInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listManagerInfo(
			@RequestParam int searchType,
			@RequestParam String searchData,
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = null;
		int userCode = common.getSessionLoginCode(request);
		if(userCode <= 0) resultData = null;
		else {
			int userLevel = common.getSessionLoginLevel(request);
			int groupCode = common.getSessionGroupCode(request);
			
			Map<String,Object> paramData = new HashMap<String, Object>();
			paramData.put("searchType", searchType);
			paramData.put("searchData", searchData);
			
			resultData = settingDAO.selectManagerInfo(paramData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="detailUserInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String detailUserInfo(@RequestParam int userCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = settingDAO.selectDetailUserInfo(userCode);
		String userPwd = "";
		try {
			AES256 aes256 = new AES256();
			userPwd = aes256.decrypt(resultData.get("tmi_pwd").toString());
		} catch (Exception e) {
			// TODO: handle exception
		}
		resultData.put("tmi_pwd", userPwd);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}	
	
	@RequestMapping(value="saveUserInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String saveUserInfo(@RequestParam Map<String,Object> formData, HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			AES256 aes256 = new AES256();
			String userPwd = aes256.encrypt(formData.get("edit_user_pwd").toString());
			formData.put("edit_user_pwd", userPwd);
			resultData = settingDAO.saveUserInfo(formData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="removeUserInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeUserInfo(@RequestParam int userCode,HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			resultData = settingDAO.deleteUserInfo(userCode);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}

	@RequestMapping(value="listSalesTypeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listSalesTypeInfo(
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = null;
		int userCode = common.getSessionLoginCode(request);
		if(userCode <= 0) resultData = null;
		else {
			resultData = settingDAO.selectSalesTypeData();
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="detailSalesTypeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String detailSalesTypeInfo(@RequestParam int typeCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = settingDAO.selectDetailSalesTypeInfo(typeCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}	
	
	@RequestMapping(value="saveSalesTypeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String saveSalesTypeInfo(@RequestParam int typeCode, @RequestParam String typeName, HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			Map<String,Object> paramData = new HashMap<String, Object>();
			paramData.put("typeCode", typeCode);
			paramData.put("typeName", typeName);
			resultData = settingDAO.saveSalesTypeInfo(paramData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="removeSalesTypeInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeSalesTypeInfo(@RequestParam int typeCode,HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			resultData = settingDAO.deleteSalesTypeInfo(typeCode);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="listContractCompanyInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listContractCompanyInfo(
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = null;
		int userCode = common.getSessionLoginCode(request);
		if(userCode <= 0) resultData = null;
		else {
			resultData = settingDAO.selectContractCompanyInfo();
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="detailContractCompanyInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String detailContractCompanyInfo(@RequestParam int companyCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = settingDAO.selectDetailContractCompanyInfo(companyCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}	
	
	@RequestMapping(value="saveContractCompanyInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String saveContractCompanyInfo(@RequestParam int companyCode, @RequestParam String companyName, HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			Map<String,Object> paramData = new HashMap<String, Object>();
			paramData.put("companyCode", companyCode);
			paramData.put("companyName", companyName);
			resultData = settingDAO.saveContractCompanyInfo(paramData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="removeContractCompanyInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeContractCompanyInfo(@RequestParam int companyCode,HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			resultData = settingDAO.deleteContractCompanyInfo(companyCode);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
}
