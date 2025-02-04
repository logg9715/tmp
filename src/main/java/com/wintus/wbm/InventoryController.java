package com.wintus.wbm;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.wintus.wbm.common.AES256; 
import com.wintus.wbm.common.common;
import com.wintus.wbm.dao.InventoryDAO;

import net.sf.json.JSONObject;

/**
 * Handles requests for the application home page.
 */
@Controller("inventoryController")
@EnableAspectJAutoProxy
public class InventoryController { 
	@Autowired
	private InventoryDAO inventoryDAO;
	
	private int sessionTmiCode;
	private int m_iLevel;
	
	private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);
	
	// 관제센터 현황 정보 처음 페이지 로딩 시 처리
	@RequestMapping(value= "inventory" ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView inventory(HttpServletRequest request, HttpServletResponse response) throws Exception{
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
	
	// 관제센터 현황 정보 처음 페이지 로딩 시 처리
	@RequestMapping(value= "inventory_sub" ,method={RequestMethod.POST,RequestMethod.GET})
	public ModelAndView inventory_sub(HttpServletRequest request, HttpServletResponse response) throws Exception{
		ModelAndView mav = new ModelAndView();
		Integer inventoryCode = 0;
		try {
			inventoryCode = Integer.parseInt(request.getParameter("inventory_code").toString());
		} catch (Exception e) {
			// TODO: handle exception
		}
		if(inventoryCode <= 0) {
			response.setContentType("text/html; charset=UTF-8");
			PrintWriter out = response.getWriter();
			out.println("<script>alert('정상적인 경로가 아닙니다.');");
			out.println("history.back();</script>");
			out.flush();
			return null; 
		} else {
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
				
				mav.addObject("inventoryCode", inventoryCode);
				String viewName=(String)request.getAttribute("viewName");
				mav.setViewName(viewName);	 
			}		
			return mav; 
		}

	}	
	
	@RequestMapping(value="listInventoryInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listInventoryInfo(
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception {
		List<Map<String,Object>> resultData = null;
		int userCode = common.getSessionLoginCode(request);
		if(userCode <= 0) resultData = null;
		else {
			int userLevel = common.getSessionLoginLevel(request);
			int groupCode = common.getSessionGroupCode(request);
			
			resultData = inventoryDAO.selectInventoryInfo();
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="detailInventoryInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String detailInventoryInfo(@RequestParam int inventoryCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = inventoryDAO.selectDetailInventoryInfo(inventoryCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}	
	
	@RequestMapping(value="saveInventoryInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String saveInventoryInfo(@RequestParam Map<String,Object> formData, HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			formData.put("userCode", userLoginCode);
			resultData = inventoryDAO.saveInventoryInfo(formData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="removeInventoryInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeInventoryInfo(@RequestParam int inventoryCode,HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			resultData = inventoryDAO.deleteInventoryInfo(inventoryCode);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="listInventorySubInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String listInventorySubInfo(
			@RequestParam int inventoryCode,
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
			paramData.put("inventoryCode", inventoryCode);
			paramData.put("searchType", searchType);
			paramData.put("searchData", searchData);
			
			resultData = inventoryDAO.selectInventorySubInfo(paramData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);	 	
		
		String jsonInfo = totalObject.toString();		
		return jsonInfo;
	}
	
	@RequestMapping(value="detailInventorySubInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String detailInventorySubInfo(@RequestParam int inventorySubCode,HttpServletResponse response) throws Exception {
		Map<String,Object> resultData = inventoryDAO.selectDetailInventorySubInfo(inventorySubCode);
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}	
	
	@RequestMapping(value="saveInventorySubInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String saveInventorySubInfo(@RequestParam Map<String,Object> formData, HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			formData.put("userCode", userLoginCode);
			resultData = inventoryDAO.saveInventorySubInfo(formData);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="removeInventorySubInfo", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String removeInventorySubInfo(@RequestParam int inventorySubCode,HttpServletRequest request, HttpServletResponse response) throws Exception {
		int resultData = 0;
		int userLoginCode = common.getSessionLoginCode(request);
		if(userLoginCode <= 0) resultData = -99;
		else {
			resultData = inventoryDAO.deleteInventorySubInfo(inventorySubCode);
		}
		
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}
	
	@RequestMapping(value="inventoryCountCheck", method={RequestMethod.POST, RequestMethod.GET},produces = "application/text; charset=utf8")
	public @ResponseBody String inventoryCountCheck(@RequestParam int inventoryCode, HttpServletResponse response) throws Exception {
		Map<String,Integer> resultData = inventoryDAO.selectInventoryCount(inventoryCode);
		logger.info("resultData=" + resultData);
		JSONObject totalObject = new JSONObject();
		totalObject.put("resultData", resultData);  
		String jsonInfo = totalObject.toString();
		
		return jsonInfo; 
	}	
}
