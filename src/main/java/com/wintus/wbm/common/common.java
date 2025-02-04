package com.wintus.wbm.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession; 

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.wintus.wbm.MainController;
import com.wintus.wbm.common.AES256;

public class common {
	private static final Logger logger = LoggerFactory.getLogger(MainController.class);
	public static void setLoginInfoSession(HttpServletRequest request, Map<String,Object> paramData) {
		HttpSession session = request.getSession();
		
		session.setAttribute("userCode", paramData.get("userCode"));
		session.setAttribute("userId", paramData.get("userId"));
		session.setAttribute("userName", paramData.get("userName"));
		session.setAttribute("userLevel", paramData.get("userLevel"));
		session.setAttribute("levelName", paramData.get("levelName"));
		session.setAttribute("groupName", paramData.get("groupName"));
		session.setAttribute("groupCode", paramData.get("groupCode"));
	}
	
	static public Map<String,Object> getSessionValue(HttpServletRequest request) throws Exception {
		AES256 aes256 = new AES256();
		
		HttpSession session = request.getSession();
		
		Map<String,Object> mapResultData = new HashMap<String, Object>();
		mapResultData.put("userCode", aes256.decrypt(session.getAttribute("userCode").toString()));
		mapResultData.put("userId", session.getAttribute("userId").toString());
		mapResultData.put("userName", aes256.decrypt(session.getAttribute("userName").toString()));		
		mapResultData.put("userLevel", aes256.decrypt(session.getAttribute("userLevel").toString()));		
		mapResultData.put("levelName", aes256.decrypt(session.getAttribute("levelName").toString()));		
		mapResultData.put("groupName", aes256.decrypt(session.getAttribute("groupName").toString()));		
		mapResultData.put("groupCode", aes256.decrypt(session.getAttribute("groupCode").toString()));		
		
		return mapResultData;
	}
	
	static public int getSessionLoginCode(HttpServletRequest request) throws NumberFormatException, Exception {
		AES256 aes256 = new AES256();
		HttpSession session = request.getSession();		
		return session.getAttribute("userCode") == null?0:Integer.parseInt(aes256.decrypt(session.getAttribute("userCode").toString()));
	}
	
	static public int getSessionLoginLevel(HttpServletRequest request) throws NumberFormatException, Exception {
		AES256 aes256 = new AES256();
		HttpSession session = request.getSession();		
		return session.getAttribute("userLevel") == null?0:Integer.parseInt(aes256.decrypt(session.getAttribute("userLevel").toString()));
	}
	
	static public String getSessionLoginName(HttpServletRequest request) throws NumberFormatException, Exception {
		AES256 aes256 = new AES256();
		HttpSession session = request.getSession();		
		return session.getAttribute("userName") == null?"":aes256.decrypt(session.getAttribute("userName").toString());
	}
	
	static public String getSessionLevelName(HttpServletRequest request) throws NumberFormatException, Exception {
		AES256 aes256 = new AES256();
		HttpSession session = request.getSession();		
		return session.getAttribute("levelName") == null?"":aes256.decrypt(session.getAttribute("levelName").toString());
	}
	
	static public String getSessionGroupName(HttpServletRequest request) throws NumberFormatException, Exception {
		AES256 aes256 = new AES256();
		HttpSession session = request.getSession();		
		return session.getAttribute("groupName") == null?"":aes256.decrypt(session.getAttribute("groupName").toString());
	}
	
	static public int getSessionGroupCode(HttpServletRequest request) throws NumberFormatException, Exception {
		AES256 aes256 = new AES256();
		HttpSession session = request.getSession();		
		return session.getAttribute("groupCode") == null?0:Integer.parseInt(aes256.decrypt(session.getAttribute("groupCode").toString()));
	}
	
	static public String getSessionUserId(HttpServletRequest request) throws NumberFormatException, Exception {
		AES256 aes256 = new AES256();
		HttpSession session = request.getSession();		
		return session.getAttribute("userId") == null?"":aes256.decrypt(session.getAttribute("userId").toString());
	}
	
	
	static public void setSessionLogout(HttpServletRequest request) {
		HttpSession session = request.getSession();	

		session.removeAttribute("userCode");
		session.removeAttribute("userId");
		session.removeAttribute("userName");
		session.removeAttribute("userLevel");
		session.removeAttribute("levelName");
		session.removeAttribute("groupName");
		
		session.invalidate();
	}
	
	public static String fileUpload(MultipartHttpServletRequest multipartRequest, String imageFolder) throws Exception{
		Path currentPath = Paths.get("webapps\\wbm_data\\" + imageFolder);
		String savePath = currentPath.toAbsolutePath().toString();
		
		if(savePath.toUpperCase().indexOf("WINDOW")>=0) savePath = "e:\\webapps\\wbm_data\\" + imageFolder;
		
		File saveFilePath = new File(savePath);
		if (!saveFilePath.exists()) saveFilePath.mkdirs();
		
		SimpleDateFormat currentDate = new SimpleDateFormat("yyyyMMddhhmmssSSS");
		String fileNameDate = currentDate.format(new Date());
		
		String resFileName = "";
		String targetFileName = "";
		Iterator<String> fileNames = multipartRequest.getFileNames();
		
		logger.info("fileNames=" + fileNames );
		while(fileNames.hasNext()){
			String fileName = fileNames.next();
			MultipartFile mFile = multipartRequest.getFile(fileName); 
			resFileName = mFile.getOriginalFilename();
			if(resFileName == null || resFileName == "") continue;
			targetFileName = fileNameDate + "_" + resFileName;
			// logger.info("fileName=" + fileName);
			logger.info("resFilexName=" + resFileName);
			// File saveFile = new File(savePath + "\\"+ fileName);
			if(mFile.getSize()!=0) { 
				// if(!saveFile.exists()) saveFile.createNewFile();
				mFile.transferTo(new File(savePath + "\\"+ targetFileName)); 
			}
		}
		logger.info("targetFileName=" + targetFileName);
		return targetFileName;
	}
	
	public static List<Map<String,Object>> fileUploads(MultipartHttpServletRequest multipartRequest, String uploadFileTag, String imageFolder) throws Exception{
		Path currentPath = Paths.get("webapps\\wbm_data\\" + imageFolder);
		String savePath = currentPath.toAbsolutePath().toString();
		
		if(savePath.toUpperCase().indexOf("WINDOW")>=0) savePath = "e:\\webapps\\wbm_data\\" + imageFolder;
		File saveFilePath = new File(savePath);
		if (!saveFilePath.exists()) saveFilePath.mkdirs();
		
		SimpleDateFormat currentDate = new SimpleDateFormat("yyyyMMddhhmmssSSS");
		String fileNameDate = currentDate.format(new Date());
		
		String resFileName = "";
		String targetFileName = "";
		List<Map<String,Object>> lstResultUploadInfo = new ArrayList<Map<String,Object>>();
		List<MultipartFile> lstUploadFileInfo = multipartRequest.getFiles(uploadFileTag);
		for(MultipartFile lfi : lstUploadFileInfo){
			resFileName = lfi.getOriginalFilename();
			logger.info("resFileName=" + resFileName + "," + lfi.getName() + " ," + lfi.getSize());
			if(resFileName == null || resFileName.equals("") || lfi.getSize() <= 0) continue;
			targetFileName = fileNameDate + "_" + resFileName;
			try {
				lfi.transferTo(new File(savePath + "\\"+ targetFileName));
				
				Map<String,Object> mapUploadFileInfo = new HashMap<String, Object>();
				mapUploadFileInfo.put("resFileName", resFileName);
				mapUploadFileInfo.put("targetFileName", targetFileName);
				// logger.info("resFilexName=" + resFileName + "," + targetFileName);
				lstResultUploadInfo.add(mapUploadFileInfo);
			} catch (Exception e) {
				logger.info("file upload error=" + e.toString());
			}
		}
		return lstResultUploadInfo;
	}
	
	static public void download(
			@RequestParam String resFileName,
			@RequestParam String fileName,
		    @RequestParam String imageFolder,
			HttpServletResponse response) throws Exception {
		Path currentPath = Paths.get("webapps\\wbm_data\\" + imageFolder);
		String savePath = currentPath.toAbsolutePath().toString();
		
		if(savePath.toUpperCase().indexOf("WINDOW")>=0) savePath = "e:\\webapps\\wbm_data\\" + imageFolder;

		OutputStream out = response.getOutputStream();
		String filePath = savePath + "\\" + fileName;
		File image=new File(filePath);
		String encodedFileName = URLEncoder.encode(resFileName, "UTF-8").replaceAll("\\+", "%20");

		
		response.setHeader("Cache-Control","no-cache");
		response.addHeader("Content-disposition", "attachment; fileName=" + encodedFileName);
		FileInputStream in=new FileInputStream(image); 
		byte[] buffer=new byte[1024*8];
		while(true){
			int count=in.read(buffer); //���ۿ� �о���� ���ڰ���
			if(count==-1)  
				break;
			out.write(buffer,0,count);
		}
		in.close();
		out.close();
	}
	
	static public void fileDownload(@RequestParam String fileName,@RequestParam String resName,
			@RequestParam String imageFolder,
			HttpServletResponse response) throws Exception {
		Path currentPath = Paths.get("webapps\\wbm_data\\" + imageFolder);
		String savePath = currentPath.toAbsolutePath().toString();
		
		if(savePath.toUpperCase().indexOf("WINDOW")>=0) savePath = "e:\\webapps\\wbm_data\\" + imageFolder;
		
		OutputStream out = response.getOutputStream();
		String filePath = savePath + "\\" + fileName;
		File image=new File(filePath);
		String encodedFileName = URLEncoder.encode(resName, "UTF-8").replaceAll("\\+", "%20");
		
		response.setHeader("Cache-Control","no-cache");
		response.addHeader("Content-disposition", "attachment; filename="+encodedFileName);
		FileInputStream in=new FileInputStream(image); 
		byte[] buffer=new byte[1024*8];
		while(true){
			int count=in.read(buffer);
			if(count==-1) break;
			out.write(buffer,0,count);
		}
		in.close();
		out.close();
	}
}
