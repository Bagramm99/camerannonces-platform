package com.camerannonces.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.URI;
import java.util.UUID;

/**
 * Service pour gérer les uploads vers Backblaze B2
 * Compatible avec l'API S3
 */
@Service
public class BackblazeB2Service {

    @Value("${backblaze.keyId}")
    private String keyId;

    @Value("${backblaze.applicationKey}")
    private String applicationKey;

    @Value("${backblaze.bucketName}")
    private String bucketName;

    @Value("${backblaze.endpoint}")
    private String endpoint;

    @Value("${backblaze.region}")
    private String region;

    private S3Client s3Client;

    @PostConstruct
    public void init() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(keyId, applicationKey);

        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();

        System.out.println("✅ Backblaze B2 Service initialized");
        System.out.println("📦 Bucket: " + bucketName);
        System.out.println("🌍 Region: " + region);
    }

    /**
     * Upload un fichier vers Backblaze B2
     * @param file Le fichier à uploader
     * @param folder Dossier dans le bucket (ex: "profiles", "listings")
     * @return URL publique du fichier
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        // Générer nom unique
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String fileName = folder + "/" + UUID.randomUUID().toString() + extension;

        // Upload vers B2
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .acl(ObjectCannedACL.PUBLIC_READ) // Public accessible
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        // Générer URL publique
        String publicUrl = endpoint.replace("https://", "https://") + "/" + bucketName + "/" + fileName;

        System.out.println("✅ File uploaded: " + fileName);
        System.out.println("🔗 URL: " + publicUrl);

        return publicUrl;
    }

    /**
     * Supprimer un fichier de Backblaze B2
     * @param fileUrl URL complète du fichier
     */
    public void deleteFile(String fileUrl) {
        try {
            // Extraire le nom du fichier de l'URL
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            // Trouver le dossier (profiles/ ou listings/)
            String folder = "";
            if (fileUrl.contains("/profiles/")) {
                folder = "profiles/";
            } else if (fileUrl.contains("/listings/")) {
                folder = "listings/";
            }

            String key = folder + fileName;

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            System.out.println("🗑️ File deleted: " + key);

        } catch (Exception e) {
            System.err.println("❌ Error deleting file: " + e.getMessage());
        }
    }

    /**
     * Vérifier si un fichier existe
     */
    public boolean fileExists(String fileName) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            s3Client.headObject(headObjectRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        }
    }
}